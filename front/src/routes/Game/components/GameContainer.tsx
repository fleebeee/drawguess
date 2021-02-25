import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import CommonContext from '~utils/CommonContext';

import WaitingList from './WaitingList';
import PlayerList from './PlayerList';
import Chat from './Chat';

const GameContainer = ({ children }) => {
  const { ws, game, user, error, loading } = useContext(CommonContext);

  const handleLeave = () => {
    ws.send(
      JSON.stringify({
        type: 'leave',
        payload: { user },
      })
    );
  };

  const waiting = game.waiting.length && !game.waiting.includes(user.name);

  return (
    <Container>
      <Leave onClick={handleLeave}>Leave</Leave>
      <PlayerList />
      {waiting ? <WaitingList names={game.waiting} /> : children}
      <Chat />
    </Container>
  );
};

const Container = styled.div`
  min-height: 400px;
`;

const Leave = styled.div`
  color: var(--secondary-200);
  margin-bottom: 10px;
  font-size: 14px;
`;

export default GameContainer;
