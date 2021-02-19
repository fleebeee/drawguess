import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

import CommonContext from '~utils/CommonContext';
import PlayerList from '~components/PlayerList';

const PostRound = () => {
  const { ws, game, user, error, loading } = useContext(CommonContext);

  const handleNext = () => {
    ws.send(
      JSON.stringify({
        type: 'next-round',
        payload: { user },
      })
    );
  };

  console.debug('||DEBUG: [game]', game);

  return (
    <GameBox>
      <PlayerList />

      {game.postRound.map((player) => (
        <div key={player.name}>
          <div>{player.name}'s prompt: X</div>
          {player.result.map((dg) => (
            <div key={`${dg.author}-${dg.type}`}>
              <div>
                {dg.author}'s {dg.type}
              </div>
              {dg.type === 'drawing' ? (
                <Drawing src={dg.data} />
              ) : (
                <div>{dg.data}</div>
              )}
            </div>
          ))}
        </div>
      ))}

      {user && user.leader && (
        <Start onClick={handleNext}>Start next round!</Start>
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

const Drawing = styled.img``;

const Start = styled.div``;

export default PostRound;
