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
    <div>
      <What>What is this?</What>
      {drawingUrl && <Drawing src={drawingUrl} />}

      <form onSubmit={handleSubmit}>
        <GuessField
          type="text"
          placeholder="Guess"
          value={guess}
          onChange={handleGuessChange}
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

const Drawing = styled.img``;

const GuessField = styled.input``;

const What = styled.h2`
  margin-bottom: 10px;
`;

export default Guess;
