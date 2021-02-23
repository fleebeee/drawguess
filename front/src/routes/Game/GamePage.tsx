import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { useLocation, Redirect } from 'react-router-dom';

import CommonContext from '~utils/CommonContext';

import GameContainer from './components/GameContainer';
import PreGame from './views/PreGame';
import Draw from './views/Draw';
import Guess from './views/Guess';
import PostRound from './views/PostRound';
import Choose from './views/Choose';
import PostGame from './views/PostGame';

const GameView = () => {
  const [name, setName] = useState('');
  const location = useLocation();
  const { ws, game, user, error, loading } = useContext(CommonContext);

  const handleGo = () => {
    const match = location.pathname.match(/^\/game\/([a-z]{4})$/);
    if (!match || match.length < 1) {
      console.error(`Game code not found in URL ${location.pathname}`);
      return;
    }
    const code = match[1];
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  if (!user) {
    // return <Redirect to="/" />;
    return (
      <Register>
        <Name
          type="text"
          placeholder="Nickname"
          value={name}
          onChange={handleNameChange}
        ></Name>
        <Go onClick={handleGo}>Go</Go>
      </Register>
    );
  }

  if (error) {
    return (
      <GameBox>
        <div>Game is offline</div>
      </GameBox>
    );
  }

  if (loading) {
    return <GameBox>Loading</GameBox>;
  }

  if (!game) {
    return <Redirect to="/" />;
  }

  const getGameView = (game) => {
    switch (game.view) {
      case 'pregame': {
        return <PreGame />;
      }
      case 'draw': {
        return <Draw />;
      }
      case 'guess': {
        return <Guess />;
      }
      case 'post-round': {
        return <PostRound />;
      }
      case 'choose': {
        return <Choose />;
      }
      case 'post-game': {
        return <PostGame />;
      }
      default:
        return null;
    }
  };

  return <GameContainer>{getGameView(game)}</GameContainer>;
};

const Register = styled.div`
  display: flex;
  align-items: center;
`;

const Name = styled.input`
  height: 32px;
  font-size: 16px;
  padding: 4px 4px 4px 12px;
`;

const Go = styled.div`
  cursor: pointer;
  padding: 16px 24px;
  border-radius: 4px;
  color: var(--primary-300);
  background-color: var(--secondary-300);
  margin-left: 12px;
`;

export default GameView;
