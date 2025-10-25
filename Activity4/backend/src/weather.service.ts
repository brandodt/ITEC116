import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

const weatherIconMap: Record<string, string> = {
  '01d': 'sun', '01n': 'moon',
  '02d': 'cloud-sun', '02n': 'cloud-moon',
  '03d': 'cloud', '03n': 'cloud',
  '04d': 'cloud', '04n': 'cloud',
  '09d': 'cloud-rain', '09n': 'cloud-rain',
  '10d': 'cloud-drizzle', '10n': 'cloud-drizzle',
  '11d': 'cloud-lightning', '11n': 'cloud-lightning',
  '13d': 'cloud-snow', '13n': 'cloud-snow',
  '50d': 'wind', '50n': 'wind',
};

@Injectable()
export class WeatherService {
  constructor(private readonly httpService: HttpService) {}

  async getWeather(city: string): Promise<any> {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city,
    )}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city,
    )}&appid=${apiKey}&units=metric`;

    try {
      const [currentWeatherResponse, forecastResponse] = await Promise.all([
        this.httpService.axiosRef.get(currentWeatherUrl),
        this.httpService.axiosRef.get(forecastUrl),
      ]);

      const currentData = currentWeatherResponse.data;
      const forecastData = forecastResponse.data;

      // Always include 'hourly' in the response
      const hourly =
        forecastData && forecastData.list
          ? forecastData.list.slice(0, 10).map((item: any, idx: number) => ({
              time: idx === 0
                ? 'Now'
                : new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
              temp: Math.round(item.main.temp),
              icon: weatherIconMap[item.weather[0].icon] || 'cloud',
            }))
          : [];

      const weatherData = {
        city: currentData.name,
        temperature: Math.round(currentData.main.temp),
        condition: currentData.weather[0].main,
        hourly, // always present
      };

      return weatherData;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { error: 'City Not Found' };
      }
      return { error: 'Error fetching weather data' };
    }
  }
}
