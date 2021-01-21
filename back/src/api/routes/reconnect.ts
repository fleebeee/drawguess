import _ from 'lodash';

const reconnect = (api, ws, payload) => {
  const { user } = payload;

  const oldUser = _.find(api.users, (u) => u.id == parseInt(user.id, 10));

  if (!oldUser) {
    // Just reset the old user and game
    ws.send(
      JSON.stringify({
        type: 'user',
        payload: null,
      } as Message)
    );
    ws.send(
      JSON.stringify({
        type: 'game',
        payload: null,
      } as Message)
    );
    return false;
  }

  const game = _.find(api.games, (g) =>
    _.find(g.users, (u) => u === parseInt(user.id, 10))
  );

  if (game) {
    // Replace socket with new one
    oldUser.socket = ws;

    ws.send(
      JSON.stringify({
        type: 'game',
        payload: game,
      } as Message)
    );
    return false;
  }
  // Client has outdated data
  else {
    // Again, just reset
    ws.send(
      JSON.stringify({
        type: 'user',
        payload: null,
      } as Message)
    );
    ws.send(
      JSON.stringify({
        type: 'game',
        payload: null,
      } as Message)
    );
    return null;
  }
  return false;
};

export default reconnect;
