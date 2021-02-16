import WebSocket from 'ws';
import _ from 'lodash';
import { nanoid } from 'nanoid';

import User from './models/User';
import Game from './models/Game';

import create from './routes/create';
import register from './routes/register';
import join from './routes/join';
import reconnect from './routes/reconnect';
import startGame from './routes/startGame';
import clientMessage from './routes/clientMessage';
import leave from './routes/leave';
import submitDrawing from './routes/submitDrawing';

class WebSocketHandler {
  MAX_MESSAGES: number;
  lobbyId: number;
  userId: number;
  messageId: number;
  drawingId: number;
  games: Game[];
  users: User[];

  getUser = (id: number) => {
    return _.find(this.users, (u: User) => u.id === id);
  };

  register = (socket: WebSocket, name: string) => {
    const username = name;

    if (_.find(this.users, (user: User) => user.name === username)) {
      socket.send(
        JSON.stringify({
          type: 'error',
          payload: {
            type: 'USERNAME_NOT_AVAILABLE',
            string: 'Username is already in use',
          },
        })
      );
      return null;
    }

    const user = new User({
      id: this.userId++,
      name: username,
      socket,
    });

    this.users.push(user);

    return user;
  };

  authenticate = (ws: WebSocket, user: User) => {
    if (!user) {
      ws.send(
        JSON.stringify({
          type: 'error',
          payload: {
            type: 'USER_NOT_SUPPLIED',
            string: 'User was not supplied',
          },
        })
      );
      return false;
    }

    const serverUser: User = _.find(
      this.users,
      (u) => u.id === user.id && u.secret === user.secret
    );

    if (!serverUser) {
      ws.send(
        JSON.stringify({
          type: 'error',
          payload: {
            type: 'AUTH_ERROR',
            string: 'User is not authenticated',
          },
        })
      );
      return false;
    }

    return serverUser;
  };

  constructor(server) {
    this.MAX_MESSAGES = 1024;
    this.lobbyId = 1;
    this.userId = 1;
    this.messageId = 1;
    this.drawingId = 1;
    this.games = [];
    this.users = [];

    const wss = new WebSocket.Server({ server });
    const wsLog = (text: string) => console.log(`WebSocket: ${text}`);
    wss.on('connection', (ws, req) => {
      // Send game state for new connections
      // ws.send(
      //   JSON.stringify({ content: this.chat, type: 'array' } as Payload)
      // );

      ws.on('message', (message: string) => {
        const m = JSON.parse(message);
        const { type, payload } = m;

        console.debug(`Received message\n${type}:`, payload);

        switch (type) {
          case 'create-game': {
            create(this, ws, payload);
            break;
          }
          case 'register': {
            register(this, ws, payload);
            break;
          }
          case 'join': {
            join(this, ws, payload);
            break;
          }
          case 'reconnect': {
            reconnect(this, ws, payload);
            break;
          }
          case 'start-game': {
            startGame(this, ws, payload);
            break;
          }
          // User sent a message
          case 'client-message': {
            clientMessage(this, ws, payload);
            break;
          }
          case 'leave': {
            leave(this, ws, payload);
            break;
          }
          case 'submit-drawing': {
            submitDrawing(this, ws, payload);
            break;
          }
          default: {
            console.error(`Unexpected message type: ${type}`);
          }
        }
      });

      wsLog('New connection');
    });

    wsLog(`Listening for connections`);
  }
}

export default WebSocketHandler;
