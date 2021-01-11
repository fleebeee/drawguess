import React from 'react';
import { hot } from 'react-hot-loader/root';
// @ts-ignore
import { Route, Routes, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import loadable from '@loadable/component';

import Navigation from './components/Navigation';

// Lazy load routes
const Home = loadable(() => import('./routes/Home'));
const Game = loadable(() => import('./routes/Game'));

const pageTransition = {
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: '-100%' },
};

const App = () => {
  const location = useLocation();

  return (
    <>
      <React.StrictMode>
        <GlobalStyle />
        <Navigation />
        <ContentWrapper>
          <Content>
              <Routes location={location} key={location.pathname}>
                <Route exact path="/" element={<Home />} />
                <Route path="/game" element={<Game />} />
              </Routes>
          </Content>
        </ContentWrapper>
      </React.StrictMode>
    </>
  );
};

const Layout = styled.div`
  display: grid;
  grid-template-columns: 300px auto;
`;

const ContentWrapper = styled.div`
  margin-left: var(--sidebar-width);
  display: grid;
  grid-template-columns: 20px auto 20px;
  margin-top: 20px;
`;

const Content = styled.div`
  grid-column-start: 2;
  grid-column-end: 3;
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
  }

  a {
    text-decoration: none;
  }
`;

export default hot(App);
