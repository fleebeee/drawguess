import _ from 'lodash';

import User from '../models/User';
import Game from '../models/Game';
import Prompt from '../models/Prompt';

const submitPrompt = (api, ws, payload) => {
  const { user: clientUser } = payload;

  const user: User = api.authenticate(ws, clientUser);
  if (!user) return false;

  const { game } = user;

  if (game.view !== 'choose') return false;

  // If user has already submitted a Guess
  if (game.prompts.find((p) => p.author === user && p.round === game.round)) {
    return false;
  }

  const prompt: Prompt = {
    author: user,
    // If there's an odd number of players, the prompt gets sent to
    // the next player
    user: game.users.length % 2 === 0 ? user : user.getNextUser(),
    value: payload.prompt,
    round: game.round,
  };

  game.prompts.push(prompt);
  // PauseChamp
  prompt.user.prompt = prompt;
  prompt.user.send();

  game.waiting = game.waiting.filter((u) => u.id !== user.id);

  if (game.waiting.length === 0) {
    // We are ready to move on to the next phase
    game.view = 'draw';
    game.waiting = [...game.users];
    // Clean up
    game.users.forEach((user) => {
      user.choices = null;
    });
  }

  game.send();

  return game;
};

export default submitPrompt;
