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

interface ServerGame {
  code: string;
  leader: User;
  users: User[];
  started: boolean;
  turn: number;
  round: number;
  view: string;
  drawings: Drawing[];
  chat: ChatMessageServer[];
}

interface ClientGame {
  code: string;
  leader: User;
  users: User[];
  started: boolean;
  turn: number;
  round: number;
  view: string;
  drawings: Drawing[];
  chat: ChatMessageServer[];
}
