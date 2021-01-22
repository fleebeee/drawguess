import _ from 'lodash';

const join = (api, ws, payload) => {
  const { user, code } = payload;

  const serverUser = api.authenticate(ws, user);
  if (!serverUser) return false;

  const game: Game = _.find(api.games, (g: Game) => g.code === code);

  if (!game) {
    ws.send(
      JSON.stringify({
        type: 'error',
        payload: {
          type: 'GAME_NOT_FOUND',
          string: `Game ${code} not found`,
        },
      } as Message)
    );
    return false;
  }

  game.users.push(user.id);

  ws.send(
    JSON.stringify({
      type: 'game',
      payload: game,
    } as Message)
  );

  return game;
};

export default join;
