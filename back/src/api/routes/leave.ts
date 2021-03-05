import _ from 'lodash';

import User from '../models/User';

const leave = (api, ws, payload) => {
  const { user } = payload;

  const serverUser: User = api.authenticate(ws, user);
  if (!serverUser) return false;

  const { game } = serverUser;
  if (game) {
    game.users = game.users.filter((u) => u !== serverUser);
    serverUser.game = null;
  }

  api.users = api.users.filter((u) => u !== serverUser);

  ws.send(
    JSON.stringify({
      type: 'game',
      payload: null,
    })
  );

  ws.send(
    JSON.stringify({
      type: 'user',
      payload: null,
    })
  );

  return true;
};

export default leave;
