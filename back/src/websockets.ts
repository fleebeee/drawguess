import WebSocket from 'ws';
import _ from 'lodash';
import { nanoid } from 'nanoid';

interface Message {
  type: string;
  payload: ChatMessageClient | ChatMessageServer | User | string;
}

interface ChatMessageClient {
  content: string;
  author: number;
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
  users: User[];
  has_started: boolean;
  turn: number;
}

class WebSocketHandler {
  MAX_MESSAGES: number;
  lobbyId: number;
  userId: number;
  messageId: number;
  games: Game[];
  chat: ChatMessageServer[];
  users: User[];

  constructor(server) {
    this.MAX_MESSAGES = 1024;
    this.lobbyId = 1;
    this.userId = 1;
    this.messageId = 1;
    this.games = [];
    this.chat = [];
    this.users = [];

    const wss = new WebSocket.Server({ server });
    const wsLog = (text: string) => console.log(`WebSocket: ${text}`);
    wss.on('connection', (ws, req) => {
      // Send game state for new connections
      // ws.send(
      //   JSON.stringify({ content: this.chat, type: 'array' } as Payload)
      // );

      ws.on('message', (message: string) => {
        console.log(`Received message ${message} from user ${req}`);
        const m: Message = JSON.parse(message);
        const { type, payload } = m;

        switch (type) {
          case 'register':
            // Generate a random secret that is used in all interactions
            const username = payload as string;
            const secret = nanoid();

            if (_.find(this.users, (user: User) => user.name === username)) {
              ws.send(
                JSON.stringify({
                  type: 'error',
                  payload: { error: 'Username is already in use' },
                })
              );
              break;
            }

            const user: User = {
              id: this.userId++,
              name: username,
              secret,
              iat: new Date(),
              socket: ws,
            };

            this.users.push(user);

            ws.send(
              JSON.stringify({
                type: 'register',
                payload: user,
              } as Message)
            );

          // User sent a message
          case 'chatMessage':
            const clientMessage = payload as ChatMessageClient;

            // If we want to process the message somehow, do it here
            const serverMessage: ChatMessageServer = {
              ...clientMessage,
              author: 'kekw',
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
            if (this.chat.length >= this.MAX_MESSAGES) this.chat.splice(0, 1);
            this.chat.push(serverMessage);
        }
      });

      wsLog('New connection');
    });

    wsLog(`Listening for connections`);
  }
}

export default WebSocketHandler;
