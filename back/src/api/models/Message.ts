import User from './User';
import Game from './Game';

class Message {
  content: string;
  author: User;
  date: string;
  id: number;
  game: Game;

  constructor({ author, content, id }) {
    this.author = author;
    this.content = content;
    this.date = new Date().toString();
    this.id = id;
    this.game = author.game;
  }

  forClient() {
    const { content, author, date, id } = this;

    return {
      author: author.name,
      content,
      date,
      id,
    };
  }
}

export default Message;
