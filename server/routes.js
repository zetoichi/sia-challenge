import { Router } from 'express';
import { getCurrentWeather, serializeWeatherData } from './weather.js';

const router = Router();

router.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const data = await getCurrentWeather(lat, lon);

    const serialized = serializeWeatherData(data);

    res.json(serialized);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

export default router;
