import User from './api/models/User';

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
