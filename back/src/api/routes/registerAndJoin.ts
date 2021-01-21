import _ from 'lodash';

const registerAndJoin = (api, ws, payload) => {
  const newUser = api.register(ws, payload.name);
  if (!newUser) return false;

  const game: Game = _.find(api.games, (g: Game) => g.code === payload.code);

  if (!game) {
    ws.send(
      JSON.stringify({
        type: 'error',
        payload: {
          type: 'GAME_NOT_FOUND',
          string: `Game ${payload.code} not found`,
        },
      } as Message)
    );
    return false;
  }

  api.users.push(newUser);
  game.users.push(newUser.id);

  ws.send(
    JSON.stringify({
      type: 'user',
      payload: newUser,
    } as Message)
  );

  ws.send(
    JSON.stringify({
      type: 'game',
      payload: game,
    } as Message)
  );

  return newUser;
};

export default registerAndJoin;
