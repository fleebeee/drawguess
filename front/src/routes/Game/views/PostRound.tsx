import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';

import Button from '~components/Button';
import CommonContext from '~utils/CommonContext';

const Drawing = ({ drawing }) => {
  return (
    <DrawingWrapper>
      <DrawingLabel>
        {drawing.turn}. {drawing.author} drew
      </DrawingLabel>
      <DrawingImage src={drawing.data} />
    </DrawingWrapper>
  );
};

const DrawingLabel = styled.div`
  margin-bottom: 10px;
`;

const DrawingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const DrawingImage = styled.img``;

const Guess = ({ guess }) => {
  return (
    <GuessWrapper>
      <GuessLabel>
        {guess.turn}. {guess.author} believed this was:
      </GuessLabel>
      <GuessText>{guess.data}</GuessText>
    </GuessWrapper>
  );
};

const GuessWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const GuessLabel = styled.div``;

const GuessText = styled.h2`
  margin-left: 10px;
  padding-bottom: 3px;
`;

const PostRound = () => {
  const { ws, game, user, error, loading } = useContext(CommonContext);

  const handleNext = () => {
    ws.send(
      JSON.stringify({
        type: game.round >= 2 ? 'conclude' : 'next-round',
        payload: { user },
      })
    );
  };

  return (
    <Wrapper>
      {game.postRound.map((player) => (
        <DrawGuess key={player.name}>
          <PromptWrapper>
            <PromptLabel>{player.name}'s prompt:</PromptLabel>
            <Prompt>{player.prompt}</Prompt>
          </PromptWrapper>
          {player.result.map((dg) =>
            dg.type === 'drawing' ? (
              <Drawing key={`${dg.author}-drawing`} drawing={dg} />
            ) : (
              <Guess key={`${dg.author}-guess`} guess={dg} />
            )
          )}
          <Filler id="filler" />
        </DrawGuess>
      ))}

      {user && user.leader ? (
        <ButtonWrapper>
          <Button onClick={handleNext}>Start next round!</Button>
        </ButtonWrapper>
      ) : (
        <Waiting>Waiting for leader to proceed...</Waiting>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 40px;
`;

const Filler = styled.div`
  margin-left: -40px;
  margin-right: -40px;
  border-top: 2px dashed var(--secondary-700);
  height: 20px;
`;

const DrawGuess = styled.div`
  // Extend to fill also the Card padding with our background
  margin-left: -40px;
  margin-right: -40px;

  padding-left: 40px;
  padding-right: 40px;

  &:nth-child(2n) {
    background-color: var(--secondary-700);

    #filler {
      border-top: 2px dashed var(--main-700);
    }
  }
`;

const PromptWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

const PromptLabel = styled.div``;

const Prompt = styled.h2`
  margin-left: 10px;
  padding-bottom: 3px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const Waiting = styled.h2`
  text-align: center;
`;

export default PostRound;
