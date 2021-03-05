import React, { useContext } from 'react';
import styled from 'styled-components';

import CommonContext from '~utils/CommonContext';

import Button from '~components/Button';

const PreGame = () => {
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
    <Wrapper>
      <Text>Waiting for players...</Text>
      {user && user.leader && (
        <Button onClick={handleStart}>Start game!</Button>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;

const Text = styled.h2`
  margin-top: 80px;
  margin-bottom: 80px;
`;

export default PreGame;
