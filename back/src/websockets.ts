import WebSocket from 'ws';
import _ from 'lodash';
import { nanoid } from 'nanoid';
import { generateRoomCode } from './utils';

interface Message {
  type: string;
  payload: any;
}

interface ChatMessageClient {
  content: string;
  user: User;
}

interface ChatMessageServer {
  content: string;
  author: string;
  date: string;
  id: number;
}

interface User {
  id: number;
  secret: string;
  name: string;
  iat: Date;
  socket: WebSocket;
}

interface Game {
  code: string;
  users: number[];
  has_started: boolean;
  turn: number;
  chat: ChatMessageServer[];
}

class WebSocketHandler {
  MAX_MESSAGES: number;
  lobbyId: number;
  userId: number;
  messageId: number;
  games: Game[];
  users: User[];

  register = (socket, name) => {
    // Generate a random secret that is used in all interactions
    const username = name;
    const secret = nanoid();

    if (_.find(this.users, (user: User) => user.name === username)) {
      socket.send(
        JSON.stringify({
          type: 'error',
          payload: 'Username is already in use',
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
    };

    return newUser;
  };

  authenticate = (user: User) => {
    return _.find(
      this.users,
      (u) => u.id === user.id && u.secret === user.secret
    );
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
        console.log(`Received message ${message}`);
        const m: Message = JSON.parse(message);
        const { type, payload } = m;

        switch (type) {
          case 'create-game': {
            // const user: User = payload.user;
            // if (user && !this.authenticate(user)) {
            //   ws.send(
            //     JSON.stringify({
            //       type: 'error',
            //       payload: { error: 'User is not authenticated' },
            //     })
            //   );
            // }

            const user = this.register(ws, payload);
            if (!user) break;

            // Ensure a unique room code
            let code = generateRoomCode();
            while (_.has(this.games, code)) {
              code = generateRoomCode();
            }

            const newGame: Game = {
              code,
              users: [user.id],
              has_started: false,
              turn: 0,
              chat: [],
            };

            this.games.push(newGame);

            ws.send(
              JSON.stringify({
                type: 'user',
                payload: user,
              } as Message)
            );

            ws.send(
              JSON.stringify({
                type: 'game',
                payload: newGame,
              } as Message)
            );
            break;
          }
          case 'register-and-join': {
            const newUser = this.register(ws, payload.name);
            if (!newUser) break;

            const game: Game = _.find(
              this.games,
              (g: Game) => g.code === payload.code
            );

            this.users.push(newUser);
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
            break;
          }
          // User sent a message
          case 'chatMessage': {
            const clientMessage = payload as ChatMessageClient;

            const chatUser: User = this.authenticate(clientMessage.user);
            if (!chatUser) {
              ws.send(
                JSON.stringify({
                  type: 'error',
                  payload: 'User is not authenticated',
                })
              );
              break;
            }

            // If we want to process the message somehow, do it here
            const serverMessage: ChatMessageServer = {
              content: clientMessage.content,
              author: chatUser.name,
              id: this.messageId++,
              date: new Date().toString(),
            };

            const response = JSON.stringify({
              payload: serverMessage,
              type: 'chatMessage',
            } as Message);

            // Broadcast message to everyone
            wss.clients.forEach(function each(client) {
              if (client.readyState === WebSocket.OPEN) {
                client.send(response);
              }
            });

            // Store message in backlog
            //   if (this.chat.length >= this.MAX_MESSAGES) this.chat.splice(0, 1);
            //   this.chat.push(serverMessage);
          }
        }
      });

      wsLog('New connection');
    });

    wsLog(`Listening for connections`);
  }
}

export default WebSocketHandler;
