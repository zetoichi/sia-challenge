const socket = io();
const loadEvent = new CustomEvent('load');
const video = document.getElementById('video');
const weatherElement = document.getElementById('weather-p');

video.addEventListener('load', () => {
  playVideo(video, socket);
});

video.addEventListener('ended', () => {
  restartVideo(video, socket);
});

video.addEventListener('play', () => {
  socket.emit('control', { action: 'play', currentTime: video.currentTime });
});

video.addEventListener('pause', () => {
  socket.emit('control', { action: 'pause', currentTime: video.currentTime });
});

socket.on('control', ({ action, currentTime }) => {
  if (action === 'play') {
    video.currentTime = currentTime;
    video.play();
  } else if (action === 'pause') {
    video.currentTime = currentTime;
    video.pause();
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { latitude, longitude } = await getCurrentPositionAsync();

    const { weather, temperature } = await getWeatherData(latitude, longitude);

    weatherElement.textContent = `${weather} ${temperature}°C`;
  } catch (error) {
    console.error('Error getting location or weather data:', error.message);
    weatherElement.textContent =
      'Unable to retrieve your location or weather data.';
  }
});

video.dispatchEvent(loadEvent);
