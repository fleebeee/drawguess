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
  socket: import('ws'); // Just TypeScript things
  leader: boolean;
}

interface Drawing {
  author: number;
  data: string; // dataURL
  round: number;
}

interface Game {
  code: string;
  leader: number;
  users: number[];
  started: boolean;
  round: number;
  view: string;
  drawings: Drawing[];
  chat: ChatMessageServer[];
}
