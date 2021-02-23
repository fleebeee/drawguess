import React, { useState, useEffect, useRef } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import loadable from '@loadable/component';

import CommonContext from '~utils/CommonContext';

// Lazy load routes
const HomePage = loadable(() => import('./routes/Home'));
const GamePage = loadable(() => import('./routes/Game/GamePage'));

const App = () => {
  const [ws, setWs] = useState<WebSocket>(null);
  const [error, setError] = useState<ApiError>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageServer[]>([]);
  const [user, setUser] = useState<User>(null);
  const [game, setGame] = useState<Game>(null);
  const messagesRef = useRef<ChatMessageServer[]>();
  messagesRef.current = messages;

  useEffect(() => {
    setWs(new WebSocket(`ws://localhost:5002`));
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onopen = (event) => {
        console.debug('WebSocket connected');
        const id = localStorage.getItem('id');
        const secret = localStorage.getItem('secret');

        if (id && secret) {
          console.debug('Using existing credentials');
          setUser({
            id: parseInt(id, 10),
            secret,
          });

          ws.send(
            JSON.stringify({
              type: 'reconnect',
              payload: { user: { id, secret } },
            } as Message)
          );
        }
      };

      ws.onmessage = (event) => {
        const m: Message = JSON.parse(event.data);
        const { type, payload } = m;

        console.debug(`Received message\n${type}:`, payload);

        switch (type) {
          case 'chatMessages': {
            setMessages(payload as ChatMessageServer[]);
            break;
          }
          case 'chatMessage': {
            setMessages([...messagesRef.current, payload as ChatMessageServer]);
            break;
          }
          case 'user': {
            if (!payload) {
              setUser(null);
              localStorage.clear();
              break;
            }

            setUser(payload);
            localStorage.setItem('id', payload.id);
            localStorage.setItem('secret', payload.secret);
            setError(null);
            break;
          }
          case 'game': {
            if (!payload) {
              setGame(null);
              break;
            }
            setGame(payload as Game);
            setMessages(payload.chat);
            setError(null);
            break;
          }
          case 'error': {
            setError(payload as ApiError);
            break;
          }
          default: {
            console.error('Received unexpected message type:', type);
            setError({
              type: 'UNEXPECTED_MESSAGE_TYPE',
              string: 'Received unexpected message type',
            });
          }
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error observed:', event);
        setError({
          type: 'WEBSOCKET_ERROR',
          string: `WebSocket error observed: ${event}`,
        });
      };

      ws.onclose = () => {
        console.debug('WebSocket disconnected');
        setError({
          type: 'WEBSOCKET_DISCONNECTED',
          string: 'WebSocket disconnected',
        });
      };

      // Clean up function
      return () => {
        ws.close();
      };
    }
  }, [ws]);

  const commonProps = { ws, user, game, error, loading };

  return (
    <>
      <React.StrictMode>
        <GlobalStyle />
        <CommonContext.Provider value={commonProps}>
          <Content>
            {error && error.string}
            <Switch>
              <Route exact path="/">
                <HomePage />
              </Route>
              <Route path="/game">
                <GamePage messages={messages} />
              </Route>
            </Switch>
          </Content>
        </CommonContext.Provider>
      </React.StrictMode>
    </>
  );
};

const Content = styled.div`
  background-color: var(--main-700);
  padding: 40px;
`;

const mainColor = 239;
const secondaryColor = 288;

const GlobalStyle = createGlobalStyle`
  :root {
    --sidebar-width: 200px;
    --main-100: hsl(${mainColor}, 36%, 90%);
    --main-200: hsl(${mainColor}, 36%, 80%);
    --main-300: hsl(${mainColor}, 36%, 70%);
    --main-400: hsl(${mainColor}, 36%, 60%);
    --main-500: hsl(${mainColor}, 36%, 50%);
    --main-600: hsl(${mainColor}, 36%, 40%);
    --main-700: hsl(${mainColor}, 36%, 30%);
    --main-800: hsl(${mainColor}, 36%, 20%);
    --main-850: hsl(${mainColor}, 36%, 15%);
    --main-900: hsl(${mainColor}, 36%, 10%);
    --secondary-100: hsl(${secondaryColor}, 34%, 90%);
    --secondary-200: hsl(${secondaryColor}, 34%, 80%);
    --secondary-300: hsl(${secondaryColor}, 34%, 70%);
    --secondary-400: hsl(${secondaryColor}, 34%, 60%);
    --secondary-500: hsl(${secondaryColor}, 34%, 50%);
    --secondary-600: hsl(${secondaryColor}, 34%, 40%);
    --secondary-700: hsl(${secondaryColor}, 34%, 30%);
    --secondary-800: hsl(${secondaryColor}, 34%, 20%);
    --secondary-900: hsl(${secondaryColor}, 34%, 10%);
    --grey-hue: ${mainColor};
    --grey-100: hsl(var(--grey-hue), 5%, 90%);
    --grey-200: hsl(var(--grey-hue), 5%, 80%);
    --grey-300: hsl(var(--grey-hue), 5%, 70%);
    --grey-400: hsl(var(--grey-hue), 5%, 60%);
    --grey-500: hsl(var(--grey-hue), 5%, 50%);
    --grey-600: hsl(var(--grey-hue), 5%, 40%);
    --grey-700: hsl(var(--grey-hue), 5%, 30%);
    --grey-800: hsl(var(--grey-hue), 5%, 20%);
    --grey-900: hsl(var(--grey-hue), 5%, 10%);
    --white: hsl(var(--grey-hue), 5%, 90%);
  }

  html {
    width: 100%;
    background-color: var(--secondary-900);
    color: var(--white);
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  }

  body {
    margin: 0;
  }

  ul {
    list-style: none;
  }

  ul, li {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  a,
  a:link,
  a:visited,
  a:hover,
  a:active {
    text-decoration: none;
  }
`;

export default App;
