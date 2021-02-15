import { nanoid } from 'nanoid';

import Game from './Game';

class User {
  id: number;
  secret: string;
  name: string;
  iat: Date;
  socket: import('ws'); // Just TypeScript things
  leader: boolean;
  game: Game;

  constructor({ id, name, socket }) {
    this.id = id;
    this.name = name;
    this.socket = socket;
    this.secret = nanoid();
  }

  forClient() {
    const { id, secret, name, iat, leader, game } = this;
    return {
      id,
      secret,
      name,
      iat,
      leader,
      game: game.forClient(),
    };
  }

  send() {
    this.socket.send(
      JSON.stringify({
        type: 'user',
        payload: this.forClient(),
      })
    );
  }
}

export default User;
