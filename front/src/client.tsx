import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import App from './App';

declare var __DEBUG__: boolean;

if (__DEBUG__) {
  // Hot module reload
  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('root')
  );
} else {
  // In production (SSR)
  loadableReady(() => {
    ReactDOM.hydrate(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      document.getElementById('root')
    );
  });
}
