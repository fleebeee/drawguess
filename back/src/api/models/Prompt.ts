import User from './User';

type Prompt = {
  author: User;
  user: User;
  round: number;
  value: string;
};

export default Prompt;
