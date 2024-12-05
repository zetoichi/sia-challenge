import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs';

import { PORT, INDEX, VIDEO_PATH } from './settings.js';
import routes from './routes.js';

const app = express();
app.use(express.static('public'));
app.use('/api', routes);
const server = createServer(app);

const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(INDEX);
});

io.on('connection', (socket) => {
  console.log('Client connected');

  const activeStreams = new Map();

  const streamVideo = (sessionId) => {
    if (activeStreams.has(sessionId)) {
      console.log(`Stream for session ${sessionId} already active`);
      return;
    }

    const stream = fs.createReadStream(VIDEO_PATH, {
      highWaterMark: 64 * 1024,
    });

    activeStreams.set(sessionId, stream);

    const restartListener = () => {
      console.log(`Restarting video stream for session ${sessionId}`);
      stream.destroy();
      cleanupListeners();
      streamVideo(sessionId);
    };

    const disconnectListener = () => {
      console.log(
        `Client disconnected, stopping stream for session ${sessionId}`
      );
      stream.destroy();
      cleanupListeners();
    };

    const cleanupListeners = () => {
      console.log(`Cleaning up listeners for session ${sessionId}`);
      socket.off(`restart:${sessionId}`, restartListener);
      socket.off('disconnect', disconnectListener);
      stream.removeAllListeners();
      activeStreams.delete(sessionId);
    };

    socket.on(`restart:${sessionId}`, restartListener);

    socket.on('disconnect', disconnectListener);

    stream.on('data', (chunk) => {
      socket.emit(`video:${sessionId}`, chunk);
    });

    stream.on('end', () => {
      socket.emit(`end:${sessionId}`);
      console.log(`Video streaming completed for session ${sessionId}`);
      cleanupListeners();
    });

    stream.on('error', (err) => {
      console.error(`Error in stream for session ${sessionId}:`, err);
      cleanupListeners();
    });
  };

  socket.on('start', ({ sessionId }) => {
    console.log(`Starting stream for session ${sessionId}`);
    streamVideo(sessionId);
  });

  socket.on('control', (data) => {
    socket.broadcast.emit('control', data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
