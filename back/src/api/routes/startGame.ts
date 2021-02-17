import _ from 'lodash';

import User from '../models/User';
import Game from '../models/Game';

const startGame = (api, ws, payload) => {
  const { user: clientUser } = payload;

  const user = api.authenticate(ws, clientUser);
  if (!user) return false;

  // If user is authenticated and the leader of the game
  // Start it
  if (!user.leader) {
    ws.send(
      JSON.stringify({
        type: 'error',
        payload: {
          type: 'IS_NOT_LEADER',
          string: 'User is not the leader of the game',
        },
      })
    );
  }

  const { game } = user;

  game.started = true;

  game.view = 'draw';
  game.waiting = [...game.users];
  // Determine playing order
  game.users = _.shuffle(game.users);

  game.send();

  return game;
};

export default startGame;
