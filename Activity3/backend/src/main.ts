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
    .setDescription('API for managing books, authors, and categories')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000/api`);
  console.log(`Swagger documentation is available at: http://localhost:3000/api/docs`);
}

bootstrap();
