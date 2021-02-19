import { nanoid } from 'nanoid';

import User from './User';
import Game from './Game';

class Drawing {
  id: string;
  author: User;
  data: string; // dataURL
  round: number;
  turn: number;
  game: Game;

  constructor({ author, data, round, turn, game }) {
    this.author = author;
    this.data = data;
    this.round = round;
    this.turn = turn;
    this.game = game;
    this.id = nanoid();
  }

  forClient() {
    const { author, id, turn, round, game } = this;

    return {
      author: author.name,
      data: `http://localhost:5002/drawings/${id}.png`,
      turn,
      round,
      game: game.code,
      type: 'drawing',
    };
  }
}

export default Drawing;
