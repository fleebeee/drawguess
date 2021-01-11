import { createServer } from 'http';
import express from 'express';

import initializeWebSockets from './websockets';

const port = process.env.PORT ? parseInt(process.env.PORT) : 5002;

let gameId = 1;

const app = express();
app.get('/create', (req, res) => {
  res.status(200).send(gameId++);
});

const server = createServer(app);
server.listen(port, () => console.info(`Server running on port: ${port}`));

// WebSocket stuff

new initializeWebSockets(server);
