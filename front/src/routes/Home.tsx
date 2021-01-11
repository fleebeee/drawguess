import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Home = () => (
  <Wrapper>
    <Header>Welcome to drawguess</Header>
    <Create to={'/create'}>Create a new game</Create>
    <Or>OR</Or>
    <Join>Join an existing game</Join>
    <InputWrapper><Code type='text' placeholder="Paste game code here"></Code><Go to={'/create'}>Go</Go></InputWrapper>


  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Header = styled.h1`
`;

const Create = styled(Link)`
  font-size: 24px;
  color: var(--primary-300);
  background-color: var(--secondary-300);
  padding: 8px;
  border-radius: 4px;
`

const Or = styled.h3``

const Join = styled.h2`
  margin-top: 0;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Code = styled.input`
  height: 32px;
  font-size: 16px;
  padding: 4px 4px 4px 12px;
`;

const Go = styled(Link)`
  padding: 8px;
  border-radius: 4px;
  color: var(--primary-300);
  background-color: var(--secondary-300);
  margin-left: 12px;
`;

export default Home;
