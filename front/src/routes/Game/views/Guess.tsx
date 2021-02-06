import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import CommonContext from '~utils/CommonContext';

import Drawboard from '../components/Drawboard/Drawboard';

const Guess = () => {
  const { ws, game, user, error, loading } = useContext(CommonContext);

  return (
    <div>
      <div>Guess</div>
    </div>
  );
};

export default Guess;
