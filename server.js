import { createServer } from 'node:http';
import express from 'express';
import { createSocket } from './socketServer.js';

const app = express();

const httpServer = createServer(app);

// init socketServer on http server
createSocket(httpServer);

app.get('/', (req, res) => {
    res.json({ message: 'hello from server' });
});

const PORT = process.env.PORT ?? 5000;
httpServer.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
});