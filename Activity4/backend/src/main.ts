import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Weather Proxy API')
    .setDescription(
      `## Activity 4 - Weather Proxy API

This API serves as a proxy for OpenWeatherMap with built-in caching and error handling.

### Features:
- **Weather Data**: Get current weather information for any location
- **Caching**: Improved performance with intelligent caching
- **Error Handling**: Robust error handling for reliable service
- **OpenWeatherMap Integration**: Seamless integration with OpenWeatherMap API

### Usage
Query weather data by city name or coordinates.

### Base URL
Development server: \`http://localhost:3001\``,
    )
    .setVersion('1.0.0')
    .addTag('weather', 'Weather data endpoints')
    .addServer('http://localhost:3001', 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Weather Proxy API Docs',
    customCss: '.swagger-ui .topbar { display: none } body { background-color: #fafafa; } .swagger-ui { color-scheme: light; }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/api`);
}
bootstrap();
