const socket = io();
const startPlayEvent = new CustomEvent('start-play');
const video = document.getElementById('video');

video.addEventListener('start-play', () => {
  playVideo(video, socket);
});

video.addEventListener('ended', () => {
  restartVideo(video, socket);
});

video.dispatchEvent(startPlayEvent);
