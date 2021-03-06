import React, { useContext, useRef } from 'react';
import styled from 'styled-components';

import CommonContext from '~utils/CommonContext';
import { host } from '~config';

import Button from '~components/Button';

const PreGame = () => {
  const { ws, game, user } = useContext(CommonContext);
  const copyRef = useRef<HTMLInputElement>();

  const handleStart = () => {
    ws.send(
      JSON.stringify({
        type: 'start-game',
        payload: { user, game: game.code },
      })
    );
  };

  const selectInput = (event) => {
    event.target.select();
  };

  const copyToClipboard = (event) => {
    event.preventDefault();
    copyRef.current.select();
    document.execCommand('copy');
    // Revert focus to button
    event.target.focus();
  };

  return (
    <Wrapper>
      <Text>Waiting for players...</Text>
      <Code>{game.code.toUpperCase()}</Code>
      <Share>Share the room link to your friends!</Share>
      <CopyWrapper>
        <CopyInput
          ref={copyRef}
          type="text"
          value={`http://${host}:5001/game/${game.code}`}
          readOnly
          onClick={selectInput}
        />
        <CopyButton onClick={copyToClipboard}>Copy</CopyButton>
      </CopyWrapper>

      {user && user.leader && (
        <ButtonWrapper>
          <Button onClick={handleStart}>Start game</Button>
        </ButtonWrapper>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;

const Code = styled.div`
  color: var(--secondary-600);
  opacity: 0.6;
  font-weight: 700;
  font-size: 48px;
  letter-spacing: 5px;
`;

const Text = styled.h2`
  margin-top: 60px;
  margin-bottom: 20px;
`;

const Share = styled.h3`
  margin-top: 20px;
`;

const CopyWrapper = styled.div`
  display: flex;
  margin-bottom: 40px;
`;

const CopyInput = styled.input`
  height: 36px;
  font-size: 14px;
  padding: 4px 4px 4px 12px;

  &[type='text'] {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const CopyButton = styled.button`
  cursor: pointer;
  background-color: var(--main-400);
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  color: white;
  width: 60px;
`;

const ButtonWrapper = styled.div`
  margin-top: 30px;
`;

export default PreGame;
