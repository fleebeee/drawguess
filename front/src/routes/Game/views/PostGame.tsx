import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

import Button from '~components/Button';
import CommonContext from '~utils/CommonContext';

const PostGame = () => {
  const { ws, game, user, error, loading } = useContext(CommonContext);

  const handleStart = () => {
    ws.send(
      JSON.stringify({
        type: 'start-game',
        payload: { user, game: game.code },
      })
    );
  };

  return (
    <div>
      <Scores>Scores: We're not keeping score</Scores>
      {user && user.leader && (
        <Button onClick={handleStart}>Start a new game!</Button>
      )}
    </div>
  );
};

const Scores = styled.div`
  margin-bottom: 20px;
`;

export default PostGame;
