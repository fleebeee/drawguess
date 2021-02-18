import _ from 'lodash';
import { promises as fs } from 'fs';

import Guess from '../models/Guess';

const submitGuess = (api, ws, payload) => {
  const { user: clientUser, data } = payload;

  const user = api.authenticate(ws, clientUser);
  if (!user) return false;

  const { game } = user;

  if (game.view !== 'guess') return false;

  // If user has already submitted a Guess
  if (
    game.guesses.find(
      (d) => d.author === user && d.round === game.round && d.turn === game.turn
    )
  ) {
    return false;
  }

  const guess = new Guess({
    author: user,
    data,
    round: game.round,
    turn: game.turn,
    game,
    id: api.guessId++,
  });

  game.guesses.push(guess);

  game.waiting = game.waiting.filter((u) => u.id !== user.id);

  if (game.waiting.length === 0) {
    // We are ready to move on to the next phase
    // TODO check if should end
    game.turn++;
    game.view = 'draw';
    game.waiting = [...game.users];
    game.users.forEach((u) => {
      u.getNewTask();
    });
  }

  game.send();

  return game;
};

export default submitGuess;
