import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import CommonContext from '~utils/CommonContext';
import PlayerList from '~components/PlayerList';

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
    <GameBox>
      <PlayerList />
      <div>Scores: We're not keeping score</div>
      {user && user.leader && (
        <Start onClick={handleStart}>Start a new game!</Start>
      )}
    </GameBox>
  );
};

const GameBox = styled.ul`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  background-color: var(--main-700);
`;

const Start = styled.div``;

export default PostGame;
