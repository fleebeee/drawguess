import _ from 'lodash';

import User from '../models/User';
import Game from '../models/Game';

const join = (api, ws, payload) => {
  const { user, code } = payload;

  const serverUser: User = api.authenticate(ws, user);
  if (!serverUser) return false;

  const game: Game = _.find(api.games, (g: Game) => g.code === code);

  if (!game) {
    ws.send(
      JSON.stringify({
        type: 'error',
        payload: {
          type: 'GAME_NOT_FOUND',
          string: `Game ${code} not found`,
        },
      })
    );
    return false;
  }

  game.users.push(user.id);

  // Send new game data to everyone in the game
  game.send();

  return game;
};

export default join;
