import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import CommonContext from '~utils/CommonContext';

const PreGame = () => {
  const { ws, game, user, error, loading } = useContext(CommonContext);

  const handleStart = () => {
    ws.send(
      JSON.stringify({
        type: 'start-game',
        payload: { user, game: game.code },
      } as Message)
    );
  };

  return (
    <GameBox>
      <PlayerList>kek</PlayerList>
      {user && user.leader && <Start onClick={handleStart}>Start game!</Start>}
    </GameBox>
  );
};

const GameBox = styled.ul`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  background-color: var(--main-700);
`;

const PlayerList = styled.ul``;

const Start = styled.div``;

export default PreGame;
