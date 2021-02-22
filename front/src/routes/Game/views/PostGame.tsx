import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
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
      <div>Scores: We're not keeping score</div>
      {user && user.leader && (
        <Start onClick={handleStart}>Start a new game!</Start>
      )}
    </div>
  );
};

const Start = styled.div``;

export default PostGame;
