import { nanoid } from 'nanoid';
import WebSocket from 'ws';

import Game from './Game';
import Prompt from './Prompt';

import { getPreviousUser } from '../utils';

class User {
  id: number;
  secret: string;
  name: string;
  iat: Date;
  leader: boolean;
  game: Game;
  task: object;
  choices: string[];
  prompt: Prompt;
  private socket: import('ws'); // Just TypeScript things

  constructor({ id, name, socket }) {
    this.id = id;
    this.name = name;
    this.socket = socket;
    this.secret = nanoid();
    this.choices = [];
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
    const { id, secret, name, iat, leader, game, task, choices, prompt } = this;
    return {
      id,
      secret,
      name,
      iat,
      leader,
      game: game ? game.forClient() : null,
      task,
      choices,
      prompt: prompt && prompt.value,
    };
  }

  send(message?) {
    if (this.socket.readyState !== WebSocket.OPEN) {
      console.error('Trying to send to user with inactive socket');
      return false;
    }

    this.socket.send(
      message ||
        JSON.stringify({
          type: 'user',
          payload: this.forClient(),
        })
    );
  }
}

export default User;
