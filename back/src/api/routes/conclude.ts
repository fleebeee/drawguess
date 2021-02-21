import _ from 'lodash';

import User from '../models/User';
import Game from '../models/Game';

const conclude = (api, ws, payload) => {
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

  // No strict validation is needed here I think
  // If the leader wants the game to end then let it be so

  const { game } = <User>user;

  // Game ends
  game.view = 'post-game';
  game.send();
  return;
};

export default conclude;
