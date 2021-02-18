import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import CommonContext from '~utils/CommonContext';
import PlayerList from '~components/PlayerList';

import Drawboard from '../components/Drawboard/Drawboard';

const Draw = () => {
  const { ws, game, user, error, loading } = useContext(CommonContext);

  let previousGuess = user && user.task.guess && user.task.guess.data;

  return (
    <GameBox>
      <PlayerList />
      {previousGuess ? <div>Draw {previousGuess}</div> : <div>Draw :)</div>}
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

const Start = styled.div``;

export default Draw;
