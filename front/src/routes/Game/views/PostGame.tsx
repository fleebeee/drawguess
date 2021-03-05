import React, { useContext } from 'react';
import styled from 'styled-components';

import Button from '~components/Button';
import CommonContext from '~utils/CommonContext';

const PostGame = () => {
  const { ws, game, user } = useContext(CommonContext);

  const handleStart = () => {
    ws.send(
      JSON.stringify({
        type: 'start-game',
        payload: { user, game: game.code },
      })
    );
  };

  return (
    <div>
      <Scores>Scores</Scores>
      <Table>
        {game.users.map((u) => (
          <>
            <div>{u}</div>
            <div>{Math.floor(Math.random() * Math.floor(150))}</div>
          </>
        ))}
      </Table>
      {user && user.leader ? (
        <Button onClick={handleStart}>Start a new game!</Button>
      ) : (
        <Waiting>
          Waiting for leader to <br />
          start a new game...
        </Waiting>
      )}
    </div>
  );
};

const Scores = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Table = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px 20px;
  padding: 10px;
  margin-bottom: 40px;
  background: var(--secondary-800);
  border-radius: 10px;
  max-width: 250px;
  margin-left: auto;
  margin-right: auto;
`;

const Waiting = styled.h2`
  text-align: center;
`;

export default PostGame;
