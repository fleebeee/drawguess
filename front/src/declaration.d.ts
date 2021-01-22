/// <reference types="react-dom/experimental" />
/// <reference types="react/experimental" />

declare var __DEBUG__: boolean;

declare module '*.png' {
  const value: string;
  export default value;
}

interface Message {
  type: string;
  payload: any;
}

interface ChatMessageClient {
  content: string;
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
  leader: boolean;
  // iat: Date;
  // socket: WebSocket;
}

interface Game {
  code: string;
  users: number[];
  has_started: boolean;
  turn: number;
}

interface ApiError {
  type: string;
  string: string;
}
