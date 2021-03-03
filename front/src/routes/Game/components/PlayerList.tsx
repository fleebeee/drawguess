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
  position: absolute;
  right: -20px;
  top: 0;
  transform:translateX(100%);
  max-width: 250px;
  margin-bottom: 20px;
  align-self: flex-end;
`;

const Row = styled.li`
  display: grid;
  grid-template-columns: 1fr 100px;
  grid-template-rows: 1fr;
  padding: 4px;
  background: var(--secondary-700);

  & > div + div {
    text-align: center;
    margin-left: 5px;
  }

  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  &:nth-child(odd) {
    background: var(--secondary-800);
  }
`;

export default PlayerList;
