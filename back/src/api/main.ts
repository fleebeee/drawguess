import WebSocket from 'ws';
import _ from 'lodash';
import { nanoid } from 'nanoid';

import create from './routes/create';
import register from './routes/register';
import join from './routes/join';
import registerAndJoin from './routes/registerAndJoin';
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
  games: Game[];
  users: User[];

  getUser = (id: number) => {
    return _.find(this.users, (u: User) => u.id === id);
  };

  register = (socket: WebSocket, name: string) => {
    // Generate a random secret that is used in all interactions
    const username = name;
    const secret = nanoid();

    if (_.find(this.users, (user: User) => user.name === username)) {
      socket.send(
        JSON.stringify({
          type: 'error',
          payload: {
            type: 'USER_NAME_NOT_AVAILABLE',
            string: 'Username is already in use',
          },
        })
      );
      return null;
    }

    const newUser: User = {
      id: this.userId++,
      name: username,
      secret,
      iat: new Date(),
      socket,
      leader: false,
    };

    return newUser;
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
    const serverUser = _.find(
      this.users,
      (u) => u.id === user.id && u.secret === user.secret
    );

    if (!serverUser) {
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

    return serverUser;
  };

  getCurrentGame = (ws: WebSocket, user: User) => {
    const serverUser = this.authenticate(ws, user);
    if (!serverUser) return false;

    return _.find(this.games, (g) => _.find(g.users, (u) => u === user.id));
  };

  isUserInGame = (ws: WebSocket, user: User, game: Game) => {
    const serverUser = this.authenticate(ws, user);
    if (!serverUser) return false;

    // Find game;
    if (!game) {
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

    const serverGame = _.find(this.games, (g) => g.code === game);
    if (!serverGame) {
      ws.send(
        JSON.stringify({
          type: 'error',
          payload: {
            type: 'GAME_NOT_FOUND',
            string: `Game ${game} not found`,
          },
        })
      );
      return false;
    }

    if (!_.find(serverGame.users, (u) => u === serverUser.id)) {
      ws.send(
        JSON.stringify({
          type: 'error',
          payload: {
            type: 'USER_NOT_IN_GAME',
            string: `User ${serverUser.name} is not in game ${game}`,
          },
        })
      );
      return false;
    }

    return { user: serverUser, game: serverGame };
  };

  isLeader = (ws: WebSocket, user: User, game: Game) => {
    const r = this.isUserInGame(ws, user, game);
    if (!r) return false;
    return r.user.leader;
  };

  constructor(server) {
    this.MAX_MESSAGES = 1024;
    this.lobbyId = 1;
    this.userId = 1;
    this.messageId = 1;
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
        const m: Message = JSON.parse(message);
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
          // Legacy
          case 'register-and-join': {
            registerAndJoin(this, ws, payload);
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
