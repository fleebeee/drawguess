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

  const handleSubmit = (choice) => {
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
      {choices &&
        choices.map((choice) => (
          <Choice key={choice} onClick={() => handleSubmit(choice)}>
            {choice}
          </Choice>
        ))}
      <CustomField
        type="text"
        placeholder="Custom prompt"
        value={custom}
        onChange={handleCustomChange}
      />
      <Button onClick={() => handleSubmit(custom)}>Submit</Button>
    </div>
  );
};

const CustomField = styled.input``;

const Choice = styled.div``;

export default Choose;
