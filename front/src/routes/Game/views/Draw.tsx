import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import CommonContext from '~utils/CommonContext';

import Drawboard from '../components/Drawboard/Drawboard';

const Draw = () => {
  const { ws, game, user, error, loading } = useContext(CommonContext);

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
  background-color: var(--main-700);
`;

const PlayerList = styled.ul``;

const Start = styled.div``;

export default Draw;
