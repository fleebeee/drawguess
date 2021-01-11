import React, { useEffect } from 'react';
import styled from 'styled-components';

const Create = () => {
  useEffect(() => {
    // request new game, then redirect to it
  }, []);

  return (
    <Wrapper>Loading</Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export default Create;
