import _ from 'lodash';

import Drawing from '../models/Drawing';

const submitDrawing = (api, ws, payload) => {
  const { user: clientUser, game: clientGame, data } = payload;

  const user = api.authenticate(ws, clientUser);
  if (!user) return false;

  // TODO that a previous image hasn't been submitted

  const { game } = user;

  if (game.view !== 'draw') return false;

  game.drawings.push(
    new Drawing({
      author: user.id,
      data,
      round: game.round,
      turn: game.turn,
      game,
      id: api.drawingId++,
    })
  );

  game.waiting = game.waiting.filter((u) => u.id !== user.id);

  if (game.waiting.length === 0) {
    // We are ready to move on to the next phase
    game.view = 'guess';
    game.waiting = [...game.users];
  }

  game.send();

  return game;
};

export default submitDrawing;
