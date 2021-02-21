import _ from 'lodash';

import User from '../models/User';
import Game from '../models/Game';

const nextRound = (api, ws, payload) => {
  const { user: clientUser } = payload;

  const user = api.authenticate(ws, clientUser);
  if (!user) return false;

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

  const { game } = <User>user;

  game.view = 'choose';
  game.waiting = [...game.users];
  game.turn = 1;
  game.round++;
  game.newPrompts();

  // Consider shuffling?
  // game.users = _.shuffle(game.users);

  game.send();

  return game;
};

export default nextRound;
