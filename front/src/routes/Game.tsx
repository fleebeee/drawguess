import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface ClientMessage {
  content: string;
  author: string;
  date: string;
}

interface ServerMessage {
  content: string;
  author: string;
  date: string;
  id: number;
}

interface Payload {
  content: ClientMessage | ServerMessage | ServerMessage[];
  type: string;
}

const Game = () => {
  const [ws, setWs] = useState(null as WebSocket);
  const [messages, setMessages] = useState([] as ServerMessage[]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => {
    setWs(new WebSocket('ws://localhost:5002'));
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onopen = (event) => {
        console.debug('WebSocket connected');
      };

      ws.onmessage = (event) => {
        const payload: Payload = JSON.parse(event.data);
        if (payload.type === 'array') {
          setMessages(payload.content as ServerMessage[]);
          setLoading(false);
        } else {
          setMessages(
            messagesRef.current.concat(payload.content as ServerMessage)
          );
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error observed:', event);
        setError(true);
        setLoading(false);
      };

      ws.onclose = () => {
        console.debug('WebSocket disconnected');
        setError(true);
      };

      // Clean up function
      return () => {
        ws.close();
      };
    }
  }, [ws]);

  const sendMessage = (content) => {
    try {
      ws.send(
        JSON.stringify({
          content,
          author: 'Test User',
          date: new Date().toString(),
        } as ClientMessage)
      );
      console.debug('sent something');
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

  if (error) {
    return (
      <GameBox>
        <div>Game is offline</div>
      </GameBox>
    );
  }

  if (loading) {
    return <GameBox />;
  }

  return (
    <GameBox>
      {messages.map((message: ServerMessage) => (
        <Message key={message.id}>
          {message.author}: {message.content}
        </Message>
      ))}
      <TextField
        placeholder="Send a message..."
        value={input}
        onChange={handleInputChange}
      />
    </GameBox>
  );
};

const GameBox = styled.ul`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  height: 600px;
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
`;

export default Game;
