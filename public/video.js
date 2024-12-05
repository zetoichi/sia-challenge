const playVideo = (video, socket) => {
  const { mediaSource, sessionId } = getMediaSource(video);

  handleMediaSourceEvents(mediaSource, socket, sessionId);

  socket.emit('start', { sessionId });
}

const restartVideo = (video, socket) => {
  console.log('Video playback ended. Restarting stream.');
  socket.emit('restart');

  video.pause();
  video.removeAttribute('src');
  video.load();

  video.dispatchEvent(startPlayEvent);
}