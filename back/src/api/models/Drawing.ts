import User from './User';
import Game from './Game';

class Drawing {
  id: number;
  author: User;
  data: string; // dataURL
  round: number;
  turn: number;
  game: Game;

  constructor(author, data, round, turn, game) {
    this.author = author;
    this.data = data;
    this.round = round;
    this.turn = turn;
    this.game = game;
  }

  forClient() {
    const { author, data, turn, round, game } = this;

    return {
      author: author.name,
      data,
      turn,
      round,
      game: game.code,
    };
  }
}

export default Drawing;
