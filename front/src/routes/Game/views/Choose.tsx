import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import CommonContext from '~utils/CommonContext';

import Button from '~components/Button';
import FieldWithButton from '~components/FieldWithButton';

const Choose = () => {
  // This should probably be validated
  const [custom, setCustom] = useState('');

  const { ws, game, user, error, loading } = useContext(CommonContext);

  const handleSubmit = (choice: string) => {
    ws.send(
      JSON.stringify({
        type: 'submit-prompt',
        payload: { user, prompt: choice },
      })
    );
  };

  const choices = user && user.choices;

  return (
    <Wrapper>
      <h2>Choose your prompt</h2>
      <Choices>
        {choices &&
          choices.map((choice) => (
            <Button key={choice} onClick={() => handleSubmit(choice)}>
              {choice}
            </Button>
          ))}
        <FieldWithButton
          label="Submit"
          placeholder="Your own prompt..."
          value={custom}
          onChange={setCustom}
          onSubmit={handleSubmit}
        />
      </Choices>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  text-align: center;
`;

const Choices = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;

  gap: 50px;
`;

export default Choose;
