import express from 'express';
import path from 'path';
import fs from 'fs';
import React from 'react';
import compression from 'compression';
import { StaticRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { ChunkExtractor } from '@loadable/server';
import last from 'lodash/last';

import htmlTemplate from './htmlTemplate';
import App from './App';

const app = express();
const port = process.env.PORT || 5001;

const statsFile = path.resolve('dist/loadable-stats.json');
const extractor = new ChunkExtractor({ statsFile });

app.use(compression());

app.get('*', (req, res) => {
  // If the request is for a file, serve it
  if (req.url.includes('.')) {
    const filename = last(req.url.split('/'));
    const options = {
      root: __dirname,
    };

    // Check if the file exists
    fs.access(`./dist/${filename}`, fs.constants.F_OK, (err) => {
      if (err) {
        // console.debug(err);
        res.status(404).send('Not found');
        return;
      }

      res.sendFile(filename, options);
    });

    return;
  }

  // Extract styled components CSS
  const sheet = new ServerStyleSheet();
  let styleTags;
  let scriptTags;
  let linkTags;
  let reactDom;

  try {
    reactDom = ReactDOM.renderToString(
      sheet.collectStyles(
        extractor.collectChunks(
          <StaticRouter location={req.url}>
            <App />
          </StaticRouter>
        )
      )
    );
    styleTags = sheet.getStyleTags();
    scriptTags = extractor.getScriptTags();
    linkTags = extractor.getLinkTags();
  } catch (error) {
    console.error(error);
  } finally {
    sheet.seal();
  }

  const html = htmlTemplate(reactDom, styleTags, scriptTags, linkTags);

  res.status(200).send(html);
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
