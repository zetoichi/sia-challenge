import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

const VIDEO_PATH = path.join(__dirname, 'sample_640x360.webm');

let streamPosition = 0; // Track the current position of the stream

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('Client connected');

  const stream = fs.createReadStream(VIDEO_PATH, { highWaterMark: 64 * 1024 }); // Adjust chunk size as needed

  stream.on('data', (chunk) => {
    socket.emit('video-chunk', chunk);
  });

  stream.on('end', () => {
    socket.emit('end');
    console.log('Video streaming completed');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    stream.destroy();
  });
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
