const getWeatherData = async (lat, lon) => {
  try {
    const apiUrl = `/api/weather?lat=${lat}&lon=${lon}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};

async function getCurrentPositionAsync() {
  if (!navigator.geolocation) {
    console.error('Geolocation is not supported by your browser.');
    throw new Error('Geolocation is not supported by your browser.');
  }

  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      (error) => {
        reject(error);
      }
    );
  });

  const { coords } = position;
  const { latitude, longitude } = coords;
  return { latitude, longitude };
}
