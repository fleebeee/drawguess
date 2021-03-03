import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import Button from '~components/Button';
import CommonContext from '~utils/CommonContext';
import FieldWithButton from '~components/FieldWithButton';

const Guess = () => {
  const [guess, setGuess] = useState('');

  const { ws, game, user, error, loading } = useContext(CommonContext);

  const handleSubmit = () => {
    ws.send(
      JSON.stringify({
        type: 'submit-guess',
        payload: { user, game: game.code, data: guess },
      })
    );
  };

  let drawingUrl = user && user.task.drawing && user.task.drawing.data;

  return (
    <Wrapper>
      <What>What is this?</What>
      {drawingUrl && <Drawing src={drawingUrl} />}

      <FieldWithButton
        label="Submit"
        placeholder="Your guess..."
        value={guess}
        onChange={setGuess}
        onSubmit={handleSubmit}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Drawing = styled.img`
  align-self: center;
  margin-bottom: 20px;
`;

const What = styled.h2`
  margin-bottom: 10px;
`;

export default Guess;
