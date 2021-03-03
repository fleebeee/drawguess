import React, { useContext } from 'react';
import styled from 'styled-components';

const WaitingList = ({ names }) => {
  return (
    <Wrapper>
      <span>Waiting for {names.join(', ')}...</span>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
`;

export default WaitingList;
