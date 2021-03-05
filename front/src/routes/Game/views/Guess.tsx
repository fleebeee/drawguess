import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import CommonContext from '~utils/CommonContext';
import FieldWithButton from '~components/FieldWithButton';

const Guess = () => {
  const [guess, setGuess] = useState('');

  const { ws, game, user } = useContext(CommonContext);

  const handleSubmit = () => {
    ws.send(
      JSON.stringify({
        type: 'submit-guess',
        payload: { user, game: game.code, data: guess },
      })
    );
  };

  let drawingUrl = user && user.task.drawing && user.task.drawing.data;
  const author = user && user.task.drawing && user.task.drawing.author;

  return (
    <Wrapper>
      <What>What is this?</What>
      {drawingUrl ? <Drawing src={drawingUrl} /> : <Placeholder />}
      <Meta>Artist: {author}</Meta>

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
  width: 500px;
  height: 500px;
`;

const Placeholder = styled.div`
  align-self: center;
  width: 500px;
  height: 500px;
`;

const What = styled.h2`
  margin-bottom: 10px;
`;

const Meta = styled.h4`
  margin-top: 10px;
  margin-bottom: 40px;
  align-self: flex-end;
  font-weight: 400;
  color: var(--secondary-400);
`;

export default Guess;
