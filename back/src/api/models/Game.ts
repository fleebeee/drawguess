import Drawing from './Drawing';
import User from './User';
import Chat from './Chat';

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
  chat: Chat;

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
  }

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
      chat,
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
      chat: chat.forClient(),
    };
  }

  send() {
    this.users.forEach((user) =>
      user.socket.send(
        JSON.stringify({
          type: 'game',
          payload: this.forClient(),
        })
      )
    );
  }
}

export default Game;
