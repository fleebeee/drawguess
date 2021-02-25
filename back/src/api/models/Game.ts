import _ from 'lodash';

import Drawing from './Drawing';
import Guess from './Guess';
import User from './User';
import Chat from './Chat';
import Prompt from './Prompt';

class Game {
  code: string;
  leader: User;
  users: User[];
  started: boolean;
  turn: number;
  round: number;
  view: string;
  waiting: User[];
  drawings: Drawing[];
  guesses: Guess[];
  chat: Chat;
  postRound: object;
  prompts: Prompt[];

  constructor({ leader, code }) {
    this.leader = leader;
    this.users = [leader];
    this.started = false;
    this.turn = 1;
    this.round = 1;
    this.view = 'pregame';
    this.chat = new Chat(this);
    this.code = code;
    this.waiting = [];
    this.drawings = [];
    this.guesses = [];
    this.postRound = null;
    this.prompts = [];
  }

  newPrompts = () => {
    const wordsData = [
      'dog',
      'sixpack',
      'chimney',
      'satellite',
      'car',
      'beach',
      'sun',
      'sushi',
      'television',
      'snow',
      'computer',
      'pear',
      'clown',
      'road',
      'beer',
      'trampoline',
      'ketchup',
      'fork',
      'bridge',
      'windmill',
    ];
    const words = _.shuffle(wordsData);

    // Give prompts to users
    this.users.forEach((user) => {
      user.choices = _.take(words, 3);
      user.send();
    });
  };

  forClient() {
    const {
      code,
      leader,
      users,
      started,
      turn,
      round,
      view,
      drawings,
      guesses,
      chat,
      postRound,
      waiting,
    } = this;

    return {
      code,
      leader: leader.name,
      users: users.map((user) => user.name),
      started,
      turn,
      round,
      view,
      drawings: drawings.map((drawing) => drawing.id),
      guesses: guesses.map((guess) => guess.id),
      chat: chat.forClient(),
      postRound,
      waiting: waiting.map((user) => user.name),
    };
  }

  send() {
    this.users.forEach((user) => {
      user.socket.send(
        JSON.stringify({
          type: 'game',
          payload: this.forClient(),
        })
      );
    });
  }
}

export default Game;
