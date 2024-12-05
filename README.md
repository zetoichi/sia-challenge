# WebM Streaming with Looping Playback

This project demonstrates real-time streaming of a WebM video using **MediaSource Extensions (MSE)** and **Socket.IO**. It streams video chunks from the server to the client and supports seamless looping by restarting the video upon completion.


## Features

- **Video Streaming:** Streams WebM video chunks from the server to the client via WebSockets.
- **Seamless Looping:** Automatically restarts video playback after it ends.
- **Session Management:** Ensures each client gets its unique video stream.
- **MediaSource API:** Utilizes `MediaSource` for dynamic video playback in the browser.


## Prerequisites

- **Node.js**: `>= 16.x`
- **npm**: `>= 7.x`
- A sample WebM file named `sample_short.webm` placed in the `/media` directory.


## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-repo/webm-streaming-loop.git
   cd webm-streaming-loop
   ```

2. **Install dependencies**:

   ```bash
   yarn install
   ```

## Usage

1. **Start development server**:
   ```bash
   yarn start:dev
   ```

   The server runs at http://localhost:3000 by default

2. **Access the client**:
   
   Open your browser and navigate to http://localhost:3000.


## How It Works

### Client

- The MediaSource API dynamically appends video chunks as they are received.
- The client listens for custom events like start-play to initialize playback.
- The video restarts automatically when the ended event is triggered.

### Server

- Serves the static client files.
- Streams video chunks via a readable stream (fs.createReadStream).
- Uses Socket.IO to manage WebSocket connections and send video chunks.

## Key Concepts

### MediaSource API

The MediaSource object manages streaming video playback on the client:

- Dynamically appends video chunks using `SourceBuffer`.
- Signals the end of streaming with `endOfStream()`.

### Socket.IO

- Handles real-time communication between the client and server.
- Sends video data and streaming completion signals.

## Commands

### Development Server

```bash
yarn start:dev
```

## License

This project is open-source and available under the MIT License.