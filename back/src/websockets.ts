import WebSocket from 'ws';

interface Message {
  type: string;
  payload: ChatMessageClient | ChatMessageServer;
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

interface Player {
  id: number;
  name: string;
  points: number;
}

interface Game {
  players: Player[];
  has_started: boolean;
  turn: number;
}

class WebSocketHandler {
  MAX_MESSAGES: number;
  lobbyId: number;
  playerId: number;
  messageId: number;
  games: Game[];
  chat: ChatMessageServer[];

  constructor(server) {
    this.MAX_MESSAGES = 1024;
    this.lobbyId = 1;
    this.playerId = 1;
    this.messageId = 1;
    this.games = [];
    this.chat = [];

    const wss = new WebSocket.Server({ server });
// https://github.com/websockets/ws/blob/d1a8af4ddb1b24a4ee23acf66decb0ed0e0d8862/examples/express-session-parse/index.js
    const wsLog = (text: string) => console.log(`WebSocket: ${text}`);
    wss.on('connection', (ws, request, client) => {
      // Send game state for new connections
      // ws.send(
      //   JSON.stringify({ content: this.chat, type: 'array' } as Payload)
      // );

      ws.on('message', (message: string) => {
        console.log(`Received message ${message} from user ${client}`);
        const m: Message = JSON.parse(message);
        const { type, payload } = m;

        switch (type) {
          // User sent a message
          case 'chatMessage':
            const clientMessage = payload as ChatMessageClient;

            // If we want to process the message somehow, do it here
            const serverMessage: ChatMessageServer = {
              ...clientMessage,
              author: `${client}`,
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
            if (this.chat.length >= this.MAX_MESSAGES)
              this.chat.splice(0, 1);
            this.chat.push(serverMessage);
        }
      });

      wsLog('New connection');
    });

    wsLog(`Listening for connections`);
  }
}

export default WebSocketHandler;
