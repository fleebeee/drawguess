import _ from 'lodash';
import { generateRoomCode } from '../utils';
import User from '../models/User';
import Game from '../models/Game';

const create = (api, ws, payload) => {
  const user = api.authenticate(ws, payload.user);
  if (!user) return false;

  // Game creator is the leader
  user.leader = true;

  // Ensure a unique room code
  let code = generateRoomCode();
  while (_.has(api.games, code)) {
    code = generateRoomCode();
  }

  const game = new Game({
    leader: user,
    code,
    wordlist: api.wordlist,
  });

  api.games.push(game);
  user.game = game;

  // Update player status to leader
  user.send();
  game.send();

  return game;
};

export default create;
