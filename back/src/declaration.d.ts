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
  leader: boolean;
}

interface Game {
  code: string;
  leader: number;
  users: number[];
  started: boolean;
  turn: number;
  view: string;
  chat: ChatMessageServer[];
}
