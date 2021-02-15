import Game from './Game';
import Message from './Message';

class Chat {
  messages: Message[];
  idCounter: number;
  game: Game;

  constructor(game) {
    this.game = game;
    this.idCounter = 1;
    this.messages = [];
  }

  forClient() {
    const { messages } = this;

    return {
      messages: messages.map((message) => message.forClient()),
    };
  }

  add({ author, content }) {
    this.messages.push(
      new Message({
        author,
        content,
        id: this.idCounter++,
      })
    );

    this.broadcast();
  }

  broadcast() {
    this.game.users.forEach((user) => {
      if (user.socket.readyState === WebSocket.OPEN) {
        user.socket.send(this.forClient());
      }
    });
  }
}

export default Chat;
