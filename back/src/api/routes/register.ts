import _ from 'lodash';

const register = (api, ws, payload) => {
  const newUser = api.register(ws, payload.name);
  if (!newUser) return false;

  api.users.push(newUser);

  ws.send(
    JSON.stringify({
      type: 'user',
      payload: newUser,
    } as Message)
  );

  return newUser;
};

export default register;
