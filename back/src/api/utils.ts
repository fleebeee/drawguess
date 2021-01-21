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
