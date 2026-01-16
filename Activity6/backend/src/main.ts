import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Match Activity 3: prefix all API routes with /api
  app.setGlobalPrefix('api');

  // Swagger / OpenAPI setup (docs at /api/docs)
  const config = new DocumentBuilder()
    .setTitle('Movie Reviews API')
    .setDescription(
      `## Activity 6 - Movie Review System API

This API provides endpoints for managing movies and their reviews.

### Features:
- **Movies**: Create, read, update, and delete movies
- **Reviews**: Add and manage reviews for movies
- **Ratings**: Automatic average rating calculation

### Base URL
All endpoints are prefixed with \`/api\``,
    )
    .setVersion('1.0')
    .addTag('movies', 'Movie management endpoints')
    .addTag('reviews', 'Review management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Movie Reviews API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
