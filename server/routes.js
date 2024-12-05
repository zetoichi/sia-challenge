import 'dotenv/config';
import { Router } from 'express';

const router = Router();

router.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;
  console.log('Getting weather data for lat: ', lat, ' lon: ', lon);

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const apiBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  const apiUrl = `${apiBaseUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }

    const data = await response.json();

    const { weather, main } = data;

    res.json({
      weather: weather[0].main,
      temperature: main.temp,
      feelsLike: main.feels_like,
    });
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

export default router;
