import { ApiProperty } from '@nestjs/swagger';

export class HourlyWeatherDto {
    @ApiProperty({
        description: 'Time of forecast',
        example: 'Now',
    })
    time: string;

    @ApiProperty({
        description: 'Temperature in Celsius',
        example: 15,
    })
    temp: number;

    @ApiProperty({
        description: 'Weather icon name',
        example: 'cloud',
        enum: ['sun', 'moon', 'cloud-sun', 'cloud-moon', 'cloud', 'cloud-rain', 'cloud-drizzle', 'cloud-lightning', 'cloud-snow', 'wind']
    })
    icon: string;
}

export class WeatherResponseDto {
    @ApiProperty({
        description: 'City name',
        example: 'London',
    })
    city: string;

    @ApiProperty({
        description: 'Current temperature in Celsius',
        example: 15,
    })
    temperature: number;

    @ApiProperty({
        description: 'Weather condition',
        example: 'Clouds',
    })
    condition: string;

    @ApiProperty({
        description: 'Hourly forecast (next 10 intervals)',
        type: [HourlyWeatherDto],
    })
    hourly: HourlyWeatherDto[];
}

export class WeatherErrorDto {
    @ApiProperty({
        description: 'Error message',
        example: 'City Not Found',
    })
    error: string;
}
