import React, { useContext } from 'react';
import styled from 'styled-components';

import CommonContext from '~utils/CommonContext';

const PlayerList = () => {
  const { ws, game, user, error, loading } = useContext(CommonContext);

  return (
    <Container>
      {game.users.map((user) => (
        <div key={user}>{user}</div>
      ))}
    </Container>
  );
};

const Container = styled.ul`
  background-color: var(--main-700);

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
`;

export default PlayerList;
