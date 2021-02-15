import _ from 'lodash';

import User from '../models/User';
import Game from '../models/Game';

const leave = (api, ws, payload) => {
  const { user } = payload;

  const serverUser: User = api.authenticate(ws, user);
  if (!serverUser) return false;

  const { game } = serverUser;
  if (game) {
    game.users = game.users.filter((u) => u.id !== serverUser.id);
    serverUser.game = null;
  }

  ws.send(
    JSON.stringify({
      type: 'game',
      payload: null,
    })
  );

  serverUser.send();

  return true;
};

export default leave;
