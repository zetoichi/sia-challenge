const MIME = 'video/webm; codecs="vp8, vorbis"';

const getMediaSource = (video) => {
  const mediaSource = new MediaSource();
  const sessionId = `session_${Date.now()}`;

  video.src = URL.createObjectURL(mediaSource);

  return { mediaSource, sessionId };
};

const handleMediaSourceEvents = (mediasource, socket, sessionId) => {
  const bufferQueue = [];
  let isStreamingEnded = false;

  mediasource.addEventListener('sourceopen', () => {
    const sourceBuffer = mediasource.addSourceBuffer(MIME);

    socket.off(`video:${sessionId}`);
    socket.off(`end:${sessionId}`);

    sourceBuffer.addEventListener('updateend', () => {
      if (bufferQueue.length > 0) {
        try {
          sourceBuffer.appendBuffer(bufferQueue.shift());
        } catch (err) {
          console.error('Error appending buffer on updateend:', err);
        }
      } else if (isStreamingEnded) {
        if (!sourceBuffer.updating && mediasource.readyState === 'open') {
          console.log('Finalizing MediaSource');
          mediasource.endOfStream();
        }
      }
    });

    socket.on(`video:${sessionId}`, (chunk) => {
      if (!sourceBuffer.updating && bufferQueue.length === 0) {
        try {
          sourceBuffer.appendBuffer(new Uint8Array(chunk));
        } catch (err) {
          console.error('Error appending buffer:', err);
        }
      } else {
        bufferQueue.push(new Uint8Array(chunk));
      }
    });

    socket.on(`end:${sessionId}`, () => {
      console.log('Server finished streaming. Awaiting buffer flush...');
      isStreamingEnded = true;

      if (!sourceBuffer.updating && mediasource.readyState === 'open') {
        console.log('end: finalizing MediaSource');
        mediasource.endOfStream();
      }
    });
  });
};

const cleanupMediaSource = (video) => {
  if (video.src) {
    URL.revokeObjectURL(video.src);
    video.removeAttribute('src');
    video.load();
  }
};
