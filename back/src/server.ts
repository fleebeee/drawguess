import { createServer } from 'http';
import express from 'express';

import initializeWebSockets from './websockets';

const port = process.env.PORT ? parseInt(process.env.PORT) : 5002;

const app = express();
app.get('/', (req, res) => {
  res.status(200).send('terve');
});

const server = createServer(app);
server.listen(port, () => console.info(`Server running on port: ${port}`));

// WebSocket stuff

new initializeWebSockets(server);
