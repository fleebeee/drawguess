import WebSocket from 'ws';
import _ from 'lodash';
import { nanoid } from 'nanoid';
import { generateRoomCode } from './utils';

interface Message {
  type: string;
  payload: any;
}

interface ChatMessageClient {
  content: string;
  user: User;
}

interface ChatMessageServer {
  content: string;
  author: string;
  date: string;
  id: number;
}

interface User {
  id: number;
  secret: string;
  name: string;
  iat: Date;
  socket: WebSocket;
  leader: boolean;
}

interface Game {
  code: string;
  leader: number;
  users: number[];
  started: boolean;
  turn: number;
  view: string;
  chat: ChatMessageServer[];
}

class WebSocketHandler {
  MAX_MESSAGES: number;
  lobbyId: number;
  userId: number;
  messageId: number;
  games: Game[];
  users: User[];

  register = (socket, name) => {
    // Generate a random secret that is used in all interactions
    const username = name;
    const secret = nanoid();

    if (_.find(this.users, (user: User) => user.name === username)) {
      socket.send(
        JSON.stringify({
          type: 'error',
          payload: {
            type: 'USER_NAME_NOT_AVAILABLE',
            string: 'Username is already in use',
          },
        })
      );
      return null;
    }

    const newUser: User = {
      id: this.userId++,
      name: username,
      secret,
      iat: new Date(),
      socket,
      leader: false,
    };

    return newUser;
  };

  authenticate = (ws: WebSocket, user: User) => {
    if (!user) {
      ws.send(
        JSON.stringify({
          type: 'error',
          payload: {
            type: 'USER_NOT_SUPPLIED',
            string: 'User was not supplied',
          },
        })
      );
      return false;
    }
    const serverUser = _.find(
      this.users,
      (u) => u.id === user.id && u.secret === user.secret
    );

    if (!serverUser) {
      ws.send(
        JSON.stringify({
          type: 'error',
          payload: {
            type: 'AUTH',
            string: 'User is not authenticated',
          },
        })
      );
      return false;
    }

    return serverUser;
  };

  isUserInGame = (ws: WebSocket, user: User, game: Game) => {
    const serverUser = this.authenticate(ws, user);
    if (!serverUser) return false;

    // Find game;
    if (!game) {
      ws.send(
        JSON.stringify({
          type: 'error',
          payload: {
            type: 'CODE_MISSING',
            string: 'Game code not supplied',
          },
        })
      );
      return false;
    }

    const serverGame = _.find(this.games, (g) => g.code === game);
    if (!serverGame) {
      ws.send(
        JSON.stringify({
          type: 'error',
          payload: {
            type: 'GAME_NOT_FOUND',
            string: `Game ${game} not found`,
          },
        })
      );
      return false;
    }

    if (!_.find(serverGame.users, (u) => u === serverUser.id)) {
      ws.send(
        JSON.stringify({
          type: 'error',
          payload: {
            type: 'USER_NOT_IN_GAME',
            string: `User ${serverUser.name} is not in game ${game}`,
          },
        })
      );
      return false;
    }

    return { user: serverUser, game: serverGame };
  };

  isLeader = (ws: WebSocket, user: User, game: Game) => {
    const r = this.isUserInGame(ws, user, game);
    if (!r) return false;
    return r.user.leader;
  };

  constructor(server) {
    this.MAX_MESSAGES = 1024;
    this.lobbyId = 1;
    this.userId = 1;
    this.messageId = 1;
    this.games = [];
    this.users = [];

    const wss = new WebSocket.Server({ server });
    const wsLog = (text: string) => console.log(`WebSocket: ${text}`);
    wss.on('connection', (ws, req) => {
      // Send game state for new connections
      // ws.send(
      //   JSON.stringify({ content: this.chat, type: 'array' } as Payload)
      // );

      ws.on('message', (message: string) => {
        console.log(`Received message ${message}`);
        const m: Message = JSON.parse(message);
        const { type, payload } = m;

        switch (type) {
          case 'create-game': {
            // const user: User = payload.user;
            // if (user && !this.authenticate(user)) {
            //   ws.send(
            //     JSON.stringify({
            //       type: 'error',
            //       payload: { error: 'User is not authenticated' },
            //     })
            //   );
            // }

            const user = this.register(ws, payload);
            if (!user) break;

            // Game creator is the leader
            user.leader = true;

            this.users.push(user);

            // Ensure a unique room code
            let code = generateRoomCode();
            while (_.has(this.games, code)) {
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

            this.games.push(newGame);

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
            break;
          }
          // New user joins an existing game
          case 'register-and-join': {
            const newUser = this.register(ws, payload.name);
            if (!newUser) break;

            const game: Game = _.find(
              this.games,
              (g: Game) => g.code === payload.code
            );

            if (!game) {
              ws.send(
                JSON.stringify({
                  type: 'error',
                  payload: {
                    type: 'GAME_NOT_FOUND',
                    string: `Game ${payload.code} not found`,
                  },
                } as Message)
              );
              break;
            }

            this.users.push(newUser);
            game.users.push(newUser.id);

            ws.send(
              JSON.stringify({
                type: 'user',
                payload: newUser,
              } as Message)
            );

            ws.send(
              JSON.stringify({
                type: 'game',
                payload: game,
              } as Message)
            );
            break;
          }
          case 'reconnect': {
            const { user } = payload;

            const oldUser = _.find(
              this.users,
              (u) => u.id == parseInt(user.id, 10)
            );

            if (!oldUser) {
              // Just reset the old user and game
              ws.send(
                JSON.stringify({
                  type: 'user',
                  payload: null,
                } as Message)
              );
              ws.send(
                JSON.stringify({
                  type: 'game',
                  payload: null,
                } as Message)
              );
              break;
            }

            const game = _.find(this.games, (g) =>
              _.find(g.users, (u) => u === parseInt(user.id, 10))
            );

            if (game) {
              // Replace socket with new one
              oldUser.socket = ws;

              ws.send(
                JSON.stringify({
                  type: 'game',
                  payload: game,
                } as Message)
              );
              break;
            }
            // Client has outdated data
            else {
              // Again, just reset
              ws.send(
                JSON.stringify({
                  type: 'user',
                  payload: null,
                } as Message)
              );
              ws.send(
                JSON.stringify({
                  type: 'game',
                  payload: null,
                } as Message)
              );
              break;
            }
            break;
          }

          case 'start-game': {
            const { user: clientUser, game: clientGame } = payload;

            const result = this.isUserInGame(ws, clientUser, clientGame);
            if (!result) break;

            const { user, game } = result;

            // If user is authenticated and the leader of the game
            // Start it
            if (!user.leader) {
              ws.send(
                JSON.stringify({
                  type: 'error',
                  payload: {
                    type: 'IS_NOT_LEADER',
                    string: 'User is not the leader of the game',
                  },
                })
              );
            }

            game.started = true;

            game.view = 'draw';
            game.waiting = _.copy(game.users);
            game.users.forEach((u) => {
              u.socket.send(
                JSON.stringify({
                  type: 'game',
                  payload: game,
                })
              );
            });
            break;
          }
          // User sent a message
          case 'client-message': {
            const clientMessage = payload as ChatMessageClient;

            const chatUser: User = this.authenticate(ws, clientMessage.user);
            if (!chatUser) {
              ws.send(
                JSON.stringify({
                  type: 'error',
                  payload: {
                    type: 'AUTH',
                    string: 'User is not authenticated',
                  },
                })
              );
              break;
            }

            // Find game
            const gameCode = payload.gameCode;
            if (!gameCode) {
              ws.send(
                JSON.stringify({
                  type: 'error',
                  payload: {
                    type: 'CODE_MISSING',
                    string: 'Game code not supplied',
                  },
                })
              );
              break;
            }

            const chatGame: Game = _.find(
              this.games,
              (g) => g.code === gameCode
            );
            if (!chatGame) {
              ws.send(
                JSON.stringify({
                  type: 'error',
                  payload: {
                    type: 'GAME_NOT_FOUND',
                    string: `Game ${gameCode} not found`,
                  },
                })
              );
              break;
            }

            if (!_.find(chatGame.users, (u) => u === chatUser.id)) {
              ws.send(
                JSON.stringify({
                  type: 'error',
                  payload: {
                    type: 'USER_NOT_IN_GAME',
                    string: `User ${chatUser.name} is not in game ${gameCode}`,
                  },
                })
              );
              break;
            }

            // If we want to process the message somehow, do it here
            const serverMessage: ChatMessageServer = {
              content: clientMessage.content,
              author: chatUser.name,
              id: this.messageId++,
              date: new Date().toString(),
            };

            const response = JSON.stringify({
              payload: serverMessage,
              type: 'chatMessage',
            } as Message);

            chatGame.chat.push(serverMessage);

            // Broadcast message to everyone
            chatGame.users.forEach((id) => {
              const u = _.find(this.users, (u) => u.id === id);
              if (!u) {
                console.error(
                  `User with ID ${id} was not found in game ${chatGame.code} when broadcasting`
                );
              }
              if (u.socket.readyState === WebSocket.OPEN) {
                u.socket.send(response);
              }
            });
            break;
          }
          case 'leave': {
            const { user } = payload;

            const serverUser = this.authenticate(ws, user);
            if (!serverUser) break;

            ws.send(
              JSON.stringify({
                type: 'game',
                payload: null,
              } as Message)
            );
            break;
          }
          default: {
            console.error(`Unexpected message type: ${type}`);
          }
        }
      });

      wsLog('New connection');
    });

    wsLog(`Listening for connections`);
  }
}

export default WebSocketHandler;
