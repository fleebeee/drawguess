import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import CommonContext from '~utils/CommonContext';

import PlayerList from './PlayerList';

const GameContainer = ({ children }) => {
  const { ws, game, user, error, loading } = useContext(CommonContext);

  return (
    <Container>
      <PlayerList />
      {children}
    </Container>
  );
};

const Container = styled.ul`
  height: 100%;
`;

export default GameContainer;
