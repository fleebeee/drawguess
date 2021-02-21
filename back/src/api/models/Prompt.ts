import User from './User';

type Prompt = {
  author: User;
  round: number;
  value: string;
};

export default Prompt;
