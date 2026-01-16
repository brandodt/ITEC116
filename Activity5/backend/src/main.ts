import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Blog Platform API')
    .setDescription(
      `## Activity 5 - Blog Platform API

This API provides a complete blogging platform with user authentication, post management, and commenting system.

### Features:
- **Authentication**: Secure user registration and login with JWT tokens
- **Users**: User profile management
- **Posts**: Create, read, update, and delete blog posts
- **Comments**: Add and manage comments on blog posts

### Authentication
Protected endpoints require a Bearer token. Click the 🔒 **Authorize** button to add your JWT token.

### Base URL
Development server: \`http://localhost:3000\``,
    )
    .setVersion('1.0.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('posts', 'Blog post endpoints')
    .addTag('comments', 'Comment endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addServer('http://localhost:3000', 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Blog Platform API Docs',
    customCss: '.swagger-ui .topbar { display: none } body { background-color: #fafafa; } .swagger-ui { color-scheme: light; }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
  console.log(`Swagger documentation available at: http://localhost:3000/api`);
}
bootstrap();
