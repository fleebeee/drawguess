import _ from 'lodash';
import WebSocket from 'ws';

import User from '../models/User';
import Message from '../models/Message';

const clientMessage = (api, ws, payload) => {
  const message: Message = payload;

  const user: User = api.authenticate(ws, message.author);
  if (!user) {
    ws.send(
      JSON.stringify({
        type: 'error',
        payload: {
          type: 'AUTH',
          string: 'User is not authenticated',
        },
      })
    );
    return false;
  }

  // Find game
  const { game } = user;
  if (!game) {
    ws.send(
      JSON.stringify({
        type: 'error',
        payload: {
          type: 'USER_NOT_IN_GAME',
          string: 'User is not in a game',
        },
      })
    );
    return false;
  }

  game.chat.add({
    content: message.content,
    author: user,
  });
};

export default clientMessage;
