import WebSocket from 'ws';

interface ClientMessage {
  content: string;
  author: number;
}

interface ServerMessage {
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

interface Payload {
  content: Game | ServerMessage[] | ServerMessage;
  type: string;
}

class WebSocketHandler {
  MAX_MESSAGES: number;
  lobbyId: number;
  playerId: number;
  messageId: number;
  games: Game[];
  chat: ServerMessage[];

  constructor(server) {
    this.MAX_MESSAGES = 1024;
    this.lobbyId = 1;
    this.playerId = 1;
    this.messageId = 1;
    this.games = [];
    this.chat = [];

    const wss = new WebSocket.Server({ server });

    const wsLog = (text: string) => console.log(`WebSocket: ${text}`);
    wss.on('connection', (ws, req) => {
      // Send game state for new connections
      console.debug('||DEBUG: [req.url]', req.url);
      ws.send(
        JSON.stringify({ content: this.chat, type: 'array' } as Payload)
      );

      ws.on('message', (clientMessageJSON: string) => {
        const clientMessage: ClientMessage = JSON.parse(clientMessageJSON);

        // If we want to process the message somehow, do it here
        const serverMessage: ServerMessage = {
          ...clientMessage,
          author: `${clientMessage.author}`,
          id: this.messageId++,
          date: new Date().toString(),
        };

        const payload = JSON.stringify({
          content: serverMessage,
          type: 'message',
        } as Payload);

        // Broadcast message to everyone
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
          }
        });

        // Store message in backlog
        if (this.chat.length >= this.MAX_MESSAGES)
          this.chat.splice(0, 1);
        this.chat.push(serverMessage);
      });

      wsLog('New connection');
    });

    wsLog(`Listening for connections`);
  }
}

export default WebSocketHandler;
