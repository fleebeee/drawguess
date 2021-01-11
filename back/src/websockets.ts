import WebSocket from 'ws';

interface ClientMessage {
  content: string;
  author: string;
  date: string;
}

interface ServerMessage {
  content: string;
  author: string;
  date: string;
  id: number;
}

interface Payload {
  content: ClientMessage | ServerMessage | ServerMessage[];
  type: string;
}

class WebSocketHandler {
  MAX_MESSAGES: number;
  id: number;
  messages: ServerMessage[];

  constructor(server) {
    this.MAX_MESSAGES = 1024;
    this.id = 1;
    this.messages = [];

    const wss = new WebSocket.Server({ server });

    const wsLog = (text: string) => console.log(`WebSocket: ${text}`);
    wss.on('connection', (ws) => {
      // Send backlog for new connections
      ws.send(
        JSON.stringify({ content: this.messages, type: 'array' } as Payload)
      );

      ws.on('message', (clientMessageJSON: string) => {
        const clientMessage: ClientMessage = JSON.parse(clientMessageJSON);

        // If we want to process the message somehow, do it here
        const serverMessage: ServerMessage = {
          ...clientMessage,
          id: this.id++,
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
        if (this.messages.length >= this.MAX_MESSAGES)
          this.messages.splice(0, 1);
        this.messages.push(serverMessage);
      });

      wsLog('New connection');
    });

    wsLog(`Listening for connections`);
  }
}

export default WebSocketHandler;
