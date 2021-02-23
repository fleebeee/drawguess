import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

import CommonContext from '~utils/CommonContext';

import Button from '~components/Button';

const PreGame = () => {
  const { ws, game, user, error, loading } = useContext(CommonContext);

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
  height: 100%;
`;

export default PreGame;
