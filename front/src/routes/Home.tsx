import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import CommonContext from '~utils/CommonContext';

const Home = () => {
  const { ws, user, game } = useContext(CommonContext);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [deferredCreate, setDeferredCreate] = useState<boolean>(false);
  const [deferredJoin, setDeferredJoin] = useState<boolean>(false);

  const handleCreate = async () => {
    ws.send(
      JSON.stringify({
        type: 'register',
        payload: { name },
      } as Message)
    );
    setDeferredCreate(true);
  };

  useEffect(() => {
    if (deferredCreate && user) {
      ws.send(
        JSON.stringify({
          type: 'create-game',
          payload: { user },
        } as Message)
      );
      setDeferredCreate(false);
    }
  }, [user]);

  const handleGo = () => {
    ws.send(
      JSON.stringify({
        type: 'register',
        payload: { name },
      } as Message)
    );
    setDeferredJoin(true);
  };

  useEffect(() => {
    if (deferredJoin && user) {
      ws.send(
        JSON.stringify({
          type: 'join',
          payload: { user, code },
        } as Message)
      );
      setDeferredJoin(false);
    }
  });

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  if (game && game.code) {
    return <Redirect to={`/game/${game.code}`} />;
  }

  return (
    <Wrapper>
      <Header>Welcome to drawguess</Header>
      <Name
        type="text"
        placeholder="Nickname"
        value={name}
        onChange={handleNameChange}
      ></Name>
      <Create onClick={handleCreate}>Create a new game</Create>
      <Or>OR</Or>
      <Join>Join an existing game</Join>
      <BottomRow>
        <InputWrapper>
          <Name
            type="text"
            placeholder="Nickname"
            value={name}
            onChange={handleNameChange}
          ></Name>
          <Code
            type="text"
            placeholder="Game code"
            value={code}
            onChange={handleCodeChange}
          ></Code>
        </InputWrapper>
        <Go onClick={handleGo}>Go</Go>
      </BottomRow>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Header = styled.h1``;

const Create = styled.div`
  font-size: 24px;
  color: var(--primary-300);
  background-color: var(--secondary-300);
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
`;

const Or = styled.h3``;

const Join = styled.h2`
  margin-top: 0;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Code = styled.input`
  height: 32px;
  font-size: 16px;
  padding: 4px 4px 4px 12px;
`;

const Name = styled(Code)`
  margin-bottom: 8px;
`;

const Go = styled.div`
  cursor: pointer;
  padding: 16px 24px;
  border-radius: 4px;
  color: var(--primary-300);
  background-color: var(--secondary-300);
  margin-left: 12px;
`;

export default Home;
