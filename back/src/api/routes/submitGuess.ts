import _ from 'lodash';

import Guess from '../models/Guess';
import User from '../models/User';

const submitGuess = (api, ws, payload) => {
  const { user: clientUser, data } = payload;

  const user = api.authenticate(ws, clientUser);
  if (!user) return false;

  const { game } = <User>user;

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

  // The game must always end on a guess
  const evenPlayerCount = game.users.length % 2 === 0;
  const maxRounds = evenPlayerCount ? game.users.length : game.users.length - 1;
  const endCondition = game.turn >= maxRounds;

  if (game.waiting.length === 0) {
    // We are ready to move on to the next phase

    if (endCondition) {
      // New round begins
      game.view = 'post-round';

      // Get drawings and guesses of this round
      const drawings = game.drawings.filter((d) => d.round === game.round);
      const guesses = game.guesses.filter((g) => g.round === game.round);

      game.postRound = game.users.map((u, i) => {
        // Construct sequence of draws and guesses
        const result = [];
        const n = game.users.length;

        console.debug(`Post-round for user ${u.name}`);
        // j represents user indices
        for (let j = evenPlayerCount ? 0 : 1; j < n; j += 2) {
          const turn = j + (evenPlayerCount ? 1 : 0);

          console.debug(
            `Finding drawing by user ${
              game.users[(i + j) % n].name
            } on turn ${turn}`
          );
          const drawing = drawings.find(
            (d) => d.author === game.users[(i + j) % n] && d.turn === turn
          );

          console.debug(
            `Finding guess by user ${
              game.users[(i + j + 1) % n].name
            } on turn ${turn + 1}`
          );
          const guess = guesses.find(
            (g) =>
              g.author === game.users[(i + j + 1) % n] && g.turn === turn + 1
          );

          result.push(drawing.forClient());
          result.push(guess.forClient());
        }

        const prompt = game.prompts.find(
          (prompt) => prompt.round === game.round && prompt.user === u
        );

        return {
          name: u.name,
          prompt: { value: prompt.value, author: prompt.author.name },
          result,
        };
      });

      game.send();
      return;
    }

    // Next turn
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
