import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import CommonContext from '~utils/CommonContext';

import Drawboard from '../components/Drawboard/Drawboard';

const Draw = () => {
  const { ws, game, user, error, loading } = useContext(CommonContext);

  const previousGuess =
    user && user.task && user.task.guess && user.task.guess.data;

  const prompt = user && user.prompt;

  return (
    <div>
      <WordWrapper>
        {prompt || previousGuess ? (
          <span>Draw {prompt && `your prompt`}</span>
        ) : (
          <span>Draw something</span>
        )}
        <Word>{prompt || previousGuess}</Word>
      </WordWrapper>
      <Drawboard />
    </div>
  );
};

const WordWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  line-height: 1;
`;

const Word = styled.span`
  font-size: 28px;
  margin-left: 15px;
  color: var(--secondary-300);
`;

export default Draw;
