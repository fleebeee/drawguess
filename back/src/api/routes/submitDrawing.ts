import _ from 'lodash';

const submitDrawing = (api, ws, payload) => {
  const { user: clientUser, game: clientGame, data } = payload;

  const result = api.isUserInGame(ws, clientUser, clientGame);
  if (!result) return false;

  // TODO check that we're in drawing phase

  // TODO that a previous image hasn't been submitted

  const { user, game } = result;

  game.waiting = game.waiting.filter((id) => id !== user.id);

  if (game.waiting.length === 0) {
    // We are ready to move on to the next phase
    game.view = 'guess';
    game.waiting = [...game.users];
  }

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

export default submitDrawing;
