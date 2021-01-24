import _ from 'lodash';
import { generateRoomCode } from '../utils';

const create = (api, ws, payload) => {
  const serverUser = api.authenticate(ws, payload.user);
  if (!serverUser) return false;

  // Game creator is the leader
  serverUser.leader = true;

  // Ensure a unique room code
  let code = generateRoomCode();
  while (_.has(api.games, code)) {
    code = generateRoomCode();
  }

  const newGame: Game = {
    code,
    users: [serverUser.id],
    leader: serverUser.id,
    started: false,
    turn: 1,
    view: 'pregame',
    chat: [],
  };

  api.games.push(newGame);

  ws.send(
    JSON.stringify({
      type: 'game',
      payload: newGame,
    } as Message)
  );

  return newGame;
};

export default create;
