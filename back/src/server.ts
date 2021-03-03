import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import fs from 'fs';

import initializeWebSockets from './api/main';

const port = process.env.PORT ? parseInt(process.env.PORT) : 5002;

const app = express();
app.use(cors());

app.use(express.static('public'));

// Create folder for drawings if it doesn't exist
if (!fs.existsSync('./public/drawings')) {
  fs.mkdirSync('./public/drawings', { recursive: true });
}

const server = createServer(app);
server.listen(port, () => console.info(`Server running on port: ${port}`));

// WebSocket stuff

new initializeWebSockets(server);
