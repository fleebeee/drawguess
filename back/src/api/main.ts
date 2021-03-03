import WebSocket from 'ws';
import _ from 'lodash';
import fs from 'fs';

import User from './models/User';
import Game from './models/Game';

import create from './routes/create';
import register from './routes/register';
import join from './routes/join';
import reconnect from './routes/reconnect';
import startGame from './routes/startGame';
import nextRound from './routes/nextRound';
import clientMessage from './routes/clientMessage';
import leave from './routes/leave';
import submitDrawing from './routes/submitDrawing';
import submitGuess from './routes/submitGuess';
import submitPrompt from './routes/submitPrompt';
import conclude from './routes/conclude';

class WebSocketHandler {
  MAX_MESSAGES: number;
  lobbyId: number;
  userId: number;
  messageId: number;
  guessId: number;
  games: Game[];
  users: User[];
  wordlist: string[];

  getUser = (id: number) => {
    return _.find(this.users, (u: User) => u.id === id);
  };

  register = (socket: WebSocket, name: string) => {
    const username = _.truncate(name);

    if (username.length < 1) {
      socket.send(
        JSON.stringify({
          type: 'error',
          payload: {
            type: 'USERNAME_TOO_SHORT',
            string: 'Username is too short',
          },
        })
      );
      return null;
    }

    // if (_.find(this.users, (user: User) => user.name === username)) {
    //   socket.send(
    //     JSON.stringify({
    //       type: 'error',
    //       payload: {
    //         type: 'USERNAME_NOT_AVAILABLE',
    //         string: 'Username is already in use',
    //       },
    //     })
    //   );
    //   return null;
    // }

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

    const serverUser: User = this.users.find(
      (u) =>
        u.id === parseInt((user.id as unknown) as string, 10) &&
        u.secret === user.secret
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
    this.guessId = 1;
    this.games = [];
    this.users = [];
    this.wordlist = [];

    try {
      const data = fs.readFileSync('src/wordlist.txt', 'utf8');
      this.wordlist = data.split(/\r?\n/);
    } catch (err) {
      console.error('Error reading wordlist', err);
    }

    const wss = new WebSocket.Server({ server });
    const wsLog = (text: string) => console.log(`WebSocket: ${text}`);
    wss.on('connection', (ws, req) => {
      // TODO Handle disconnections

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
          case 'next-round': {
            nextRound(this, ws, payload);
            break;
          }
          case 'conclude': {
            conclude(this, ws, payload);
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
          case 'submit-guess': {
            submitGuess(this, ws, payload);
            break;
          }
          case 'submit-prompt': {
            submitPrompt(this, ws, payload);
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
