import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import CommonContext from '~utils/CommonContext';

const Guess = () => {
  const [guess, setGuess] = useState('');

  const { ws, game, user, error, loading } = useContext(CommonContext);

  const handleGuessChange = (event) => {
    setGuess(event.target.value);
  };

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
    <div>
      {drawingUrl && <Drawing src={drawingUrl} />}
      <div>Guess</div>
      <GuessField
        type="text"
        placeholder="Guess"
        value={guess}
        onChange={handleGuessChange}
      />
      <a onClick={handleSubmit}>Submit</a>
    </div>
  );
};

const Drawing = styled.img``;

const GuessField = styled.input``;

export default Guess;
