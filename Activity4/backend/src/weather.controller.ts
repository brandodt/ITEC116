import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { WeatherService } from './weather.service';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) { }

  @Get(':city')
  @ApiOperation({
    summary: 'Get current weather and forecast for a city',
    description: 'Fetches current weather conditions and hourly forecast from OpenWeatherMap API. Results are cached for 10 minutes.',
  })
  @ApiParam({
    name: 'city',
    required: true,
    description: 'City name (e.g., London, New York, Tokyo, Imus)',
    example: 'London',
  })
  @ApiResponse({
    status: 200,
    description: 'Weather data retrieved successfully',
    schema: {
      example: {
        city: 'London',
        temperature: 15,
        condition: 'Clouds',
        hourly: [
          { time: 'Now', temp: 15, icon: 'cloud' },
          { time: '3 PM', temp: 16, icon: 'cloud' },
          { time: '6 PM', temp: 14, icon: 'cloud-rain' },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'City not found',
    schema: {
      example: { error: 'City Not Found' },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error fetching weather data',
    schema: {
      example: { error: 'Error fetching weather data' },
    },
  })
  async getWeather(@Param('city') city: string) {
    return this.weatherService.getWeather(city);
  }
}
