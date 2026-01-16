import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Set global API prefix
  app.setGlobalPrefix('api');

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Bookshelf API')
    .setDescription(
      `## Activity 3 - Bookshelf Management API

This API provides endpoints for managing books, authors, and categories in a digital library system.

### Features:
- **Books**: Create, read, update, and delete book records
- **Authors**: Manage author information
- **Categories**: Organize books by categories

### Base URL
All endpoints are prefixed with \`/api\``,
    )
    .setVersion('1.0')
    .addTag('books', 'Book management endpoints')
    .addTag('authors', 'Author management endpoints')
    .addTag('categories', 'Category management endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Bookshelf API Docs',
    customCss: '.swagger-ui .topbar { display: none } body { background-color: #fafafa; } .swagger-ui { color-scheme: light; }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });
  
  await app.listen(3000);
  console.log(`🚀 Application is running on: http://localhost:3000/api`);
  console.log(`📚 Swagger documentation is available at: http://localhost:3000/api/docs`);
}

bootstrap();
