import _ from 'lodash';

const startGame = (api, ws, payload) => {
  const { user: clientUser, game: clientGame } = payload;

  const result = api.isUserInGame(ws, clientUser, clientGame);
  if (!result) return false;

  const { user, game } = result;

  // If user is authenticated and the leader of the game
  // Start it
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

  game.started = true;

  game.view = 'draw';
  game.waiting = _.copy(game.users);
  game.users.forEach((u) => {
    const su = api.getUser(u);
    su.socket.send(
      JSON.stringify({
        type: 'game',
        payload: game,
      })
    );
  });
  return game;
};

export default startGame;
