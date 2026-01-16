import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for ngrok and local development
  app.enableCors({
    origin: true, // Allow all origins in development
    credentials: true,
  });

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Add global API prefix
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Chatroom API')
    .setDescription(
      `## Activity 8 - Chatroom REST API

This API provides endpoints for managing chatrooms and messages with real-time WebSocket support.

### Features:
- **Chatrooms**: Create and manage chat rooms
- **Messages**: Send and receive messages in real-time
- **WebSocket**: Real-time communication support

### Base URL
All endpoints are prefixed with \`/api\``,
    )
    .setVersion('1.0')
    .addTag('chatrooms', 'Chatroom management endpoints')
    .addTag('messages', 'Message endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Chatroom API Docs',
    customCss: '.swagger-ui .topbar { display: none } body { background-color: #fafafa; } .swagger-ui { color-scheme: light; }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`API Documentation: http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
bootstrap();
