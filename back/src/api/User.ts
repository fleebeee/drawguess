class User {
  id: number;
  secret: string;
  name: string;
  iat: Date;
  socket: import('ws'); // Just TypeScript things
  leader: boolean;

  constructor(name: string) {
    this.name = name;
  }
}

export default User;
