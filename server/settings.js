import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PORT = process.env.PORT || 3000;
export const INDEX = path.join(__dirname, '../client/index.html');
export const VIDEO_PATH = path.join(__dirname, '../media/sample_short.webm');

export const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
export const WEATHER_API_BASE_URL =
  'https://api.openweathermap.org/data/2.5/weather';
