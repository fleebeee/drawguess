import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const PreGame = ({ ws, game, user }) => {
  console.debug('||DEBUG: [user]', user);
  return (
    <GameBox>
      <PlayerList>kek</PlayerList>
      {user && user.leader && <Start>Start game!</Start>}
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

export default PreGame;
