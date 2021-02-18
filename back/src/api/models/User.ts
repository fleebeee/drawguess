import { nanoid } from 'nanoid';

import Game from './Game';

import { getPreviousUser } from '../utils';

class User {
  id: number;
  secret: string;
  name: string;
  iat: Date;
  socket: import('ws'); // Just TypeScript things
  leader: boolean;
  game: Game;
  task: object;

  constructor({ id, name, socket }) {
    this.id = id;
    this.name = name;
    this.socket = socket;
    this.secret = nanoid();
  }

  getNewTask = () => {
    const { game } = this;
    const previousUser: User = getPreviousUser(this);

    const round = game.round;
    const turn = game.turn - 1;

    if (game.view === 'guess') {
      const drawing = game.drawings.find(
        (d) => d.author === previousUser && d.round === round && d.turn === turn
      );

      if (!drawing) {
        console.error(
          `No drawing found with user ${previousUser.name} for round ${game.round} turn ${game.turn} in game ${game.code}`
        );
        return;
      }

      this.task = {
        type: 'guess',
        drawing: drawing.forClient(),
      };
    } else {
      const guess = game.guesses.find(
        (g) => g.author === previousUser && g.round === round && g.turn === turn
      );

      if (!guess) {
        console.error(
          `No guess found with user ${previousUser.name} for round ${game.round} turn ${game.turn} in game ${game.code}`
        );
        return;
      }

      this.task = {
        type: 'draw',
        guess: guess.forClient(),
      };
    }

    this.send();
  };

  forClient() {
    const { id, secret, name, iat, leader, game, task } = this;
    return {
      id,
      secret,
      name,
      iat,
      leader,
      game: game ? game.forClient() : null,
      task,
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
