class Game {
  code: string;
  leader: User;
  users: User[];
  started: boolean;
  turn: number;
  round: number;
  view: string;
  drawings: Drawing[];
  chat: ChatMessageServer[];

  constructor(leader: User) {
    this.leader = leader;
  }
}

export default Game;
