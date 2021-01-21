import _ from 'lodash';
import { generateRoomCode } from '../utils';

const create = (api, ws, payload) => {
  const user = api.register(ws, payload);
  if (!user) return false;

  // Game creator is the leader
  user.leader = true;

  api.users.push(user);

  // Ensure a unique room code
  let code = generateRoomCode();
  while (_.has(api.games, code)) {
    code = generateRoomCode();
  }

  const newGame: Game = {
    code,
    users: [user.id],
    leader: user.id,
    started: false,
    turn: 1,
    view: 'pregame',
    chat: [],
  };

  api.games.push(newGame);

  ws.send(
    JSON.stringify({
      type: 'user',
      payload: user,
    } as Message)
  );

  ws.send(
    JSON.stringify({
      type: 'game',
      payload: newGame,
    } as Message)
  );

  return user;
};

export default create;
