import React, { useContext } from 'react';
import styled from 'styled-components';

import CommonContext from '~utils/CommonContext';

const PlayerList = () => {
  const { ws, game, user, error, loading } = useContext(CommonContext);

  return (
    <Container>
      {game.users.map((u: string) => (
        <Row key={u}>
          <div>{u}</div>
          <div>{u === game.leader ? 'Leader' : ''}</div>
          {/* <div>{user.leader ? 'Kick' : ''}</div> */}
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

  margin-bottom: 20px;
`;

const Row = styled.li`
  display: grid;
  grid-template-columns: 1fr 100px;
  grid-template-rows: 1fr;

  & > div + div {
    text-align: center;
    margin-left: 5px;
  }
`;

export default PlayerList;
