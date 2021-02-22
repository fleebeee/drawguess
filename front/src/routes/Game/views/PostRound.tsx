import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

import CommonContext from '~utils/CommonContext';

const PostRound = () => {
  const { ws, game, user, error, loading } = useContext(CommonContext);

  const handleNext = () => {
    ws.send(
      JSON.stringify({
        type: game.round >= 2 ? 'conclude' : 'next-round',
        payload: { user },
      })
    );
  };

  return (
    <div>
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
    </div>
  );
};

const Drawing = styled.img``;

const Start = styled.div``;

export default PostRound;
