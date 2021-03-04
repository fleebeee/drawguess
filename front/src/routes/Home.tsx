import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import truncate from 'lodash/truncate';
import { FaExternalLinkAlt } from 'react-icons/fa';

import CommonContext from '~utils/CommonContext';

import Card from '~components/Card';
import Button from '~components/Button';

const Home = () => {
  const { ws, user, game } = useContext(CommonContext);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [deferredCreate, setDeferredCreate] = useState<boolean>(false);
  const [deferredJoin, setDeferredJoin] = useState<boolean>(false);

  const validName = name.length > 1 && name.length < 40;
  const validCode = code.length === 4;

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!validName) return;
    ws.send(
      JSON.stringify({
        type: 'register',
        payload: { name },
      })
    );
    setDeferredCreate(true);
  };

  useEffect(() => {
    if (deferredCreate && user) {
      ws.send(
        JSON.stringify({
          type: 'create-game',
          payload: { user },
        })
      );
      setDeferredCreate(false);
    }
  }, [user]);

  const handleGo = (event) => {
    event.preventDefault();
    if (!validName || !validCode) return;
    ws.send(
      JSON.stringify({
        type: 'register',
        payload: { name },
      })
    );
    setDeferredJoin(true);
  };

  useEffect(() => {
    if (deferredJoin && user) {
      ws.send(
        JSON.stringify({
          type: 'join',
          payload: { user, code },
        })
      );
      setDeferredJoin(false);
    }
  });

  const handleNameChange = (event) => {
    setName(truncate(event.target.value));
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value.slice(0, 4));
  };

  if (game && game.code) {
    return <Redirect to={`/game/${game.code}`} />;
  }

  return (
    <Wrapper>
      <HomeCard>
        <h1>drawguess</h1>
        <Create onSubmit={handleCreate}>
          <Name
            type="text"
            placeholder="Nickname"
            value={name}
            onChange={handleNameChange}
          ></Name>
          <Button disabled={!validName} onClick={handleCreate} fontSize={24}>
            Create a new game
          </Button>
        </Create>
        <Or>OR</Or>
        <Join>Join an existing game</Join>
        <BottomRow onSubmit={handleGo}>
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
          <Button disabled={!validName || !validCode} onClick={handleGo}>
            Go
          </Button>
        </BottomRow>
      </HomeCard>
      <Credits>
        <Credit
          href="https://github.com/Flibo/drawguess"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub <FaExternalLinkAlt />
        </Credit>
      </Credits>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Create = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Or = styled.h3``;

const Join = styled.h2`
  margin-top: 0;
`;

const BottomRow = styled.form`
  display: flex;
  align-items: center;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 15px;
`;

const Code = styled.input`
  height: 32px;
  font-size: 16px;
  padding: 4px 4px 4px 12px;
`;

const Name = styled(Code)`
  margin-bottom: 8px;
`;

const Credits = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const Credit = styled.a`
  text-shadow: 2px 2px 3px var(--main-900);
`;

const HomeCard = styled(Card)`
  padding: 40px 80px 60px 80px;
`;

export default Home;
