import { WEATHER_API_KEY, WEATHER_API_BASE_URL } from './settings.js';

export const getCurrentWeather = async (lat, lon) => {
  console.log('Getting weather data for lat: ', lat, ' lon: ', lon);

  const apiUrl = makeWeatherUrl(lat, lon);

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    throw error;
  }
};

export const serializeWeatherData = (data) => {
  const { weather, main } = data;

  return {
    weather: weather[0].main,
    temperature: main.temp,
    feelsLike: main.feels_like,
  };
};

const makeWeatherUrl = (lat, lon) => {
  return `${WEATHER_API_BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`;
};
