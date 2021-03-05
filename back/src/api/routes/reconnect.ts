import _ from 'lodash';

const reconnect = (api, ws, payload) => {
  const { user } = payload;

  const oldUser = api.authenticate(ws, user);

  // TODO make this logic more robust
  if (!oldUser) {
    // Just reset the old user and game
    ws.send(
      JSON.stringify({
        type: 'user',
        payload: null,
      })
    );
    ws.send(
      JSON.stringify({
        type: 'game',
        payload: null,
      })
    );
    return false;
  }

  // Replace socket with new one
  oldUser.socket = ws;

  const { game } = oldUser;

  if (game) {
    oldUser.send();
    ws.send(
      JSON.stringify({
        type: 'game',
        payload: game.forClient(),
      })
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
      })
    );
    ws.send(
      JSON.stringify({
        type: 'game',
        payload: null,
      })
    );
    return null;
  }
};

export default reconnect;
