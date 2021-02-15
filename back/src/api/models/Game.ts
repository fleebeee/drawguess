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
  drawings: Drawing[];
  chat: Chat;

  constructor({ leader, code }) {
    this.leader = leader;
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
