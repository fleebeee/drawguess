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
  wordlist: string[];

  constructor({ leader, code, wordlist }) {
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
    this.wordlist = wordlist;
  }

  newPrompts = () => {
    // TODO generate random indices instead of shuffling
    let words = _.shuffle(this.wordlist);

    // Give prompts to users
    this.users.forEach((user, i) => {
      if (words.length < 3) {
        console.error('We ran out of words');
        // TODO send error
        return false;
      }

      user.choices = words.slice(0, 3).map((word) => word.toLowerCase());
      user.send();
      words = words.slice(3);
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
      user.send(
        JSON.stringify({
          type: 'game',
          payload: this.forClient(),
        })
      );
    });
  }
}

export default Game;
