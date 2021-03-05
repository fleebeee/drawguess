import _ from 'lodash';

import User from '../models/User';

const startGame = (api, ws, payload) => {
  const { user: clientUser } = payload;

  const user = api.authenticate(ws, clientUser);
  if (!user) return false;

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

  const { game } = <User>user;

  game.started = true;

  game.view = 'choose';
  game.waiting = [...game.users];
  game.round = 1;
  game.turn = 1;
  game.drawings = [];
  game.guesses = [];

  game.newPrompts();

  // Determine playing order
  game.users = _.shuffle(game.users);

  game.send();

  return game;
};

export default startGame;
