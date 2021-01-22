import _ from 'lodash';

const leave = (api, ws, payload) => {
  const { user } = payload;

  const serverUser = api.authenticate(ws, user);
  if (!serverUser) return false;

  const game = api.getCurrentGame(ws, user);
  if (game) {
    game.users = _.remove(game.users, (id) => id === user.id);
  }

  ws.send(
    JSON.stringify({
      type: 'game',
      payload: null,
    } as Message)
  );
  return true;
};

export default leave;
