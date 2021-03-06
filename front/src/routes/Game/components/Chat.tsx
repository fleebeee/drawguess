import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import CommonContext from '~utils/CommonContext';

const Chat = () => {
  const [input, setInput] = useState('');
  const { ws, game, user, error, loading } = useContext(CommonContext);
  const messageContainerRef: React.RefObject<HTMLDivElement> = React.createRef();

  const messages = game && game.chat.messages;

  useEffect(() => {
    const elem = messageContainerRef.current;
    elem.scrollTop = elem.scrollHeight - elem.clientHeight;
  }, [messages]);

  const sendMessage = (content) => {
    try {
      ws.send(
        JSON.stringify({
          type: 'client-message',
          payload: { author: user, content, game: game },
        })
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

  return (
    <Wrapper>
      <Messages ref={messageContainerRef}>
        {game &&
          game.chat.messages.map((message) => (
            <Message key={message.id}>
              <Author>{message.author}</Author>: {message.content}
            </Message>
          ))}
      </Messages>
      <TextField
        placeholder="Send a message..."
        value={input}
        onChange={handleInputChange}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  max-width: 400px;
  margin-top: 50px;
`;

const Message = styled.li`
  margin-bottom: 10px;
  word-break: break-all;
`;

const TextField = styled.textarea`
  margin-top: 20px;
  background-color: var(--main-850);
  color: white;
  border-radius: 4px;
  border: 2px solid var(--main-500);
  resize: none;
  width: 100%;
  box-sizing: border-box;
`;

const Messages = styled.div`
  height: 150px;
  overflow-y: scroll;
  overflow-x: hidden;
  border: 1px solid var(--main-500);
  border-radius: 5px;
  padding: 10px;
  background-color: var(--main-850);
`;

const Author = styled.span`
  color: var(--secondary-400);
`;

export default Chat;
