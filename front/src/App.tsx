import React from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import loadable from '@loadable/component';

import useWebSocket from '~utils/useWebSocket';
import CommonContext from '~utils/CommonContext';

import GlobalStyles from './GlobalStyles';

// Lazy load routes
// const HomePage = loadable(() => import('./routes/Home'));
// const GamePage = loadable(() => import('./routes/Game/GamePage'));

import HomePage from './routes/Home';
import GamePage from './routes/Game/GamePage';

const App = () => {
  // Connect to the backend and sync data sent by it
  const [ws, user, game, error, loading, messages] = useWebSocket();

  // This data is up-to-date!
  const commonProps = { ws, user, game, error, loading, messages };

  return (
    <>
      <React.StrictMode>
        <GlobalStyles />
        <CommonContext.Provider value={commonProps}>
          <Content>
            <Error>{error && error.string}</Error>
            
            <Switch>
              <Route exact path="/">
                <HomePage />
              </Route>
              <Route path="/game">
                <GamePage />
              </Route>
            </Switch>
          </Content>
        </CommonContext.Provider>
      </React.StrictMode>
    </>
  );
};

const Content = styled.div`
  // background-color: var(--main-700);
  padding: 40px;
`;

const Error = styled.div`
  height: 20px;
`;

export default App;
