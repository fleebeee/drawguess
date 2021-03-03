import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import CommonContext from '~utils/CommonContext';

import Card from '~components/Card';
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
      
    <GameCard>
    <Leave onClick={handleLeave}>Leave</Leave>
      <PlayerList />
      <Content>{waiting ? <WaitingList names={game.waiting} /> : children}</Content>
      
      <Chat />
    </GameCard>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const GameCard = styled(Card)`
  min-width: 400px;
  position: relative;
`

const Content = styled.div`
  padding-bottom: 20px;
`;

const Leave = styled.div`
  cursor: pointer;
  color: var(--secondary-600);
  margin-bottom: 10px;
  font-size: 14px;
  align-self: flex-start;
  position: absolute;
  top: -30px;
  left: 10px;
`;

export default GameContainer;
