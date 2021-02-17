import _ from 'lodash';

import User from '../models/User';
import Game from '../models/Game';

const register = (api, ws, payload) => {
  const newUser: User = api.register(ws, payload.name);
  if (!newUser) return false;

  api.users.push(newUser);

  ws.send(
    JSON.stringify({
      type: 'user',
      payload: newUser.forClient(),
    })
  );

  return newUser;
};

export default register;
