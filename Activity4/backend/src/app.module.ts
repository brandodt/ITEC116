import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather/weather.controller';

@Module({
  imports: [
    HttpModule,
  ],
  controllers: [AppController, WeatherController],
  providers: [AppService, WeatherService],
})
export class AppModule { }
