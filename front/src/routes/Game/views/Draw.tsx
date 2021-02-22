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
      {prompt || previousGuess ? (
        <div>Draw {(prompt && `your prompt: ${prompt}`) || previousGuess}</div>
      ) : (
        <div>Draw :)</div>
      )}
      <Drawboard />
    </div>
  );
};

export default Draw;
