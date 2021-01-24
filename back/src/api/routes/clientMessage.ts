import _ from 'lodash';
import WebSocket from 'ws';

const clientMessage = (api, ws, payload) => {
  const clientMessage = payload as ChatMessageClient;

  const chatUser: User = api.authenticate(ws, clientMessage.user);
  if (!chatUser) {
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
  const gameCode = payload.gameCode;
  if (!gameCode) {
    ws.send(
      JSON.stringify({
        type: 'error',
        payload: {
          type: 'CODE_MISSING',
          string: 'Game code not supplied',
        },
      })
    );
    return false;
  }

  const chatGame: Game = _.find(api.games, (g) => g.code === gameCode);
  if (!chatGame) {
    ws.send(
      JSON.stringify({
        type: 'error',
        payload: {
          type: 'GAME_NOT_FOUND',
          string: `Game ${gameCode} not found`,
        },
      })
    );
    return false;
  }

  if (!_.find(chatGame.users, (u) => u === chatUser.id)) {
    ws.send(
      JSON.stringify({
        type: 'error',
        payload: {
          type: 'USER_NOT_IN_GAME',
          string: `User ${chatUser.name} is not in game ${gameCode}`,
        },
      })
    );
    return false;
  }

  // If we want to process the message somehow, do it here
  const serverMessage: ChatMessageServer = {
    content: clientMessage.content,
    author: chatUser.name,
    id: api.messageId++,
    date: new Date().toString(),
  };

  const response = JSON.stringify({
    payload: serverMessage,
    type: 'chatMessage',
  } as Message);

  chatGame.chat.push(serverMessage);

  // Broadcast message to everyone
  chatGame.users.forEach((id) => {
    const u = api.getUser(id);
    if (!u) {
      console.error(
        `User with ID ${id} was not found in game ${chatGame.code} when broadcasting`
      );
    }
    if (u.socket.readyState === WebSocket.OPEN) {
      u.socket.send(response);
    }
  });
  return chatGame;
};

export default clientMessage;
