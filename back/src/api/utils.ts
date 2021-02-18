const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const alphabet = Array.from('abcdefghijklmnopqrstuvwxyz');

export const generateRoomCode = () => {
  const code = [];
  for (let i = 0; i < 4; ++i) {
    code.push(alphabet[getRandomInt(alphabet.length)]);
  }
  return code.join('');
};

export const getPreviousUser = (user) => {
  const { game } = user;

  const currentIndex = game.users.findIndex((u) => u.id === user.id);
  const previousIndex =
    (currentIndex - 1 + game.users.length) % game.users.length;

  const previousUser = game.users[previousIndex];

  if (!previousUser) {
    console.error(`Previous user wasn't found for ${user.name}!`);
    return false;
  }

  return game.users[previousIndex];
};
