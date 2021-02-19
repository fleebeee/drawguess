import User from './User';
import Game from './Game';

class Guess {
  id: number;
  author: User;
  data: string;
  round: number;
  turn: number;
  game: Game;

  constructor({ author, data, round, turn, game, id }) {
    this.author = author;
    this.data = data;
    this.round = round;
    this.turn = turn;
    this.game = game;
    this.id = id;
  }

  forClient() {
    const { author, data, turn, round, game } = this;

    return {
      author: author.name,
      data,
      turn,
      round,
      game: game.code,
      type: 'guess',
    };
  }
}

export default Guess;
