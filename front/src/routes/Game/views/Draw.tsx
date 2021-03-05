import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import CommonContext from '~utils/CommonContext';

import Drawboard from '../components/Drawboard/Drawboard';

const Draw = () => {
  const { ws, game, user, error, loading } = useContext(CommonContext);

  const previousGuess =
    user && user.task && user.task.guess && user.task.guess.data;
  const author = previousGuess && user.task.guess.author;

  const prompt = user && user.prompt;

  return (
    <div>
      <WordWrapper>
        {prompt || previousGuess ? (
          <Objective>Draw {prompt && `your prompt`}</Objective>
        ) : (
          <Objective>Draw something</Objective>
        )}
        <Word>{prompt || previousGuess}</Word>
        {author && <Author>({author}'s guess)</Author>}
      </WordWrapper>
      <Drawboard />
    </div>
  );
};

const WordWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  // line-height: 1;
  margin-bottom: 15px;
`;

const Objective = styled.span`
  font-size: 18px;
`;

const Word = styled.span`
  font-size: 36px;
  font-weight: 600;
  margin-left: 15px;
  margin-bottom: 5px;
  color: var(--secondary-400);
`;

const Author = styled.span`
  margin-left: 20px;
  font-weight: 400;
  color: var(--main-400);
  font-size: 14px;
`;

export default Draw;
