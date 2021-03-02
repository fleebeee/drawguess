import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import CommonContext from '~utils/CommonContext';

import Button from '~components/Button';

const Choose = () => {
  // This should probably be validated
  const [custom, setCustom] = useState('');

  const { ws, game, user, error, loading } = useContext(CommonContext);

  const handleCustomChange = (event) => {
    setCustom(event.target.value);
  };

  const handleSubmit = (event, choice) => {
    event.preventDefault();
    ws.send(
      JSON.stringify({
        type: 'submit-prompt',
        payload: { user, prompt: choice },
      })
    );
  };

  const choices = user && user.choices;

  return (
    <div>
      <div>Choose your prompt</div>
      <Choices>
        {choices &&
          choices.map((choice) => (
            <Button
              key={choice}
              onClick={(event) => handleSubmit(event, choice)}
            >
              {choice}
            </Button>
          ))}
        <CustomWrapper onSubmit={(event) => handleSubmit(event, custom)}>
          <CustomField
            type="text"
            placeholder="Custom prompt"
            value={custom}
            onChange={handleCustomChange}
          />
          <Button onClick={(event) => handleSubmit(event, custom)}>
            Submit
          </Button>
        </CustomWrapper>
      </Choices>
    </div>
  );
};

const CustomWrapper = styled.form`
  display: flex;

  gap: 20px;
`;

const CustomField = styled.input``;

const Choices = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 50px;
`;

export default Choose;
