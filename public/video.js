const playVideo = (video, socket) => {
  const { mediaSource, sessionId } = getMediaSource(video);

  handleMediaSourceEvents(mediaSource, socket, sessionId);

  socket.emit('start', { sessionId });
};

const restartVideo = (video, socket) => {
  console.log('Video playback ended. Restarting stream.');
  socket.emit('restart');

  video.pause();
  video.removeAttribute('src');
  video.currentTime = 0;
  socket.emit('control', { action: 'play', currentTime: 0 });

  video.dispatchEvent(loadEvent);
};
