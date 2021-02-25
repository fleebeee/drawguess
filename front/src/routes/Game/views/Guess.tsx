import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import Button from '~components/Button';
import CommonContext from '~utils/CommonContext';

const Guess = () => {
  const [guess, setGuess] = useState('');

  const { ws, game, user, error, loading } = useContext(CommonContext);

  const handleGuessChange = (event) => {
    setGuess(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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

      <ButtonWrapper onSubmit={handleSubmit}>
        <GuessField
          type="text"
          placeholder="Guess"
          value={guess}
          onChange={handleGuessChange}
        />
        <Button type="submit">Submit</Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ButtonWrapper = styled.form`
  display: flex;
  margin-top: 20px;
`;

const Drawing = styled.img`
  align-self: center;
`;

const GuessField = styled.input`
  margin-right: 10px;
`;

const What = styled.h2`
  margin-bottom: 10px;
`;

export default Guess;
