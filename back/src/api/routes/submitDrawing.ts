import _ from 'lodash';
import { nanoid } from 'nanoid';
import { promises as fs } from 'fs';

import Drawing from '../models/Drawing';

const submitDrawing = (api, ws, payload) => {
  const { user: clientUser, data } = payload;

  const user = api.authenticate(ws, clientUser);
  if (!user) return false;

  const { game } = user;

  if (game.view !== 'draw') return false;

  // If user has already submitted a drawing
  if (
    game.drawings.find(
      (d) =>
        d.author.id === user.id &&
        d.round === game.round &&
        d.turn === game.turn
    )
  ) {
    return false;
  }

  const id = nanoid();

  game.drawings.push(
    new Drawing({
      author: user,
      data,
      round: game.round,
      turn: game.turn,
      game,
      id,
    })
  );

  // Save image on disk. Pray nothing goes wrong!
  const base64Data = data.replace(/^data:image\/png;base64,/, '');
  fs.writeFile(`./public/drawings/${id}.png`, base64Data, 'base64');

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
