import React, { useContext } from 'react';
import styled from 'styled-components';

import CommonContext from '~utils/CommonContext';

const PlayerList = () => {
  const { ws, game, user, error, loading } = useContext(CommonContext);

  return (
    <Container>
      {game.users.map((u) => (
        <Row key={u}>
          <div>{u}</div>
          <div>{user.leader ? 'Leader' : ''}</div>
          <div>{user.leader ? 'Kick' : ''}</div>
        </Row>
      ))}
    </Container>
  );
};

const Container = styled.ul`
  background-color: var(--secondary-700);
  max-width: 250px;

  border-radius: 4px;
  border: 1px solid var(--secondary-700);
`;

const Row = styled.li`
  display: grid;
  grid-template-columns: 1fr 75px 75px;
  grid-template-rows: 1fr;
`;

export default PlayerList;
