import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

import Drawboard from '../components/Drawboard/Drawboard';

const Draw = ({ ws, game, user }) => {
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
      <div>Draw :)</div>
      <Drawboard />
    </GameBox>
  );
};

const GameBox = styled.ul`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  height: 600px;
  background-color: var(--main-700);
`;

const PlayerList = styled.ul``;

const Start = styled.div``;

export default Draw;
