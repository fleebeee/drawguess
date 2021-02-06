import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useLocation, Redirect } from 'react-router-dom';

import PreGame from './views/PreGame';
import Draw from './views/Draw';

const GameView = ({ ws, game, user, error, loading, messages }) => {
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const location = useLocation();

  const sendMessage = (content) => {
    try {
      ws.send(
        JSON.stringify({
          type: 'client-message',
          payload: { user, content, gameCode: game.code },
        } as Message)
      );
      setInput('');
    } catch (error) {
      console.debug(error);
    }
  };

  const handleInputChange = (event) => {
    const newInput = event.target.value;
    if (newInput[newInput.length - 1] === '\n') {
      sendMessage(newInput);
    } else {
      setInput(newInput);
    }
  };

  const handleGo = () => {
    const match = location.pathname.match(/^\/game\/([a-z]{4})$/);
    if (!match || match.length < 1) {
      console.error(`Game code not found in URL ${location.pathname}`);
      return;
    }
    const code = match[1];
    ws.send(
      JSON.stringify({
        type: 'register-and-join',
        payload: { name, code },
      } as Message)
    );
  };

  const handleLeave = () => {
    ws.send(
      JSON.stringify({
        type: 'leave',
        payload: { user },
      } as Message)
    );
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
        return <PreGame ws={ws} game={game} user={user} />;
      }
      case 'draw': {
        return <Draw ws={ws} game={game} user={user} />;
      }
      default:
        return null;
    }
  };

  return (
    <GameBox>
      <div onClick={handleLeave}>Leave</div>
      <GameComponent>{getGameView(game)}</GameComponent>
      <Chat>
        <Messages>
          {messages.map((message: ChatMessageServer) => (
            <Message key={message.id}>
              {message.author}: {message.content}
            </Message>
          ))}
        </Messages>
        <TextField
          placeholder="Send a message..."
          value={input}
          onChange={handleInputChange}
        />
      </Chat>
    </GameBox>
  );
};

const GameBox = styled.ul`
  background-color: var(--main-700);
`;

const Message = styled.li`
  margin-bottom: 10px;
`;

const TextField = styled.textarea`
  margin-top: 20px;
  background-color: var(--main-900);
  color: white;
  border-radius: 4px;
  border: 2px solid var(--secondary-700);
  resize: none;
  width: 100%;
`;

const Messages = styled.div`
  width: 100%;
  height: 150px;
  overflow-y: scroll;
`;

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

const Chat = styled.div`
  width: 100%;
`;

const GameComponent = styled.div``;

export default GameView;
