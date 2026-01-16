import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('ShopNest E-Commerce API')
    .setDescription(
      `## Activity 9: Mini E-Commerce API

A RESTful API for managing products, shopping cart, and orders.

### Features
- **Products**: Browse, search, and manage product catalog
- **Cart**: Add items, adjust quantities, calculate totals
- **Orders**: Checkout with validation, view order history

### Authentication
This API currently operates without authentication for demo purposes.
    `,
    )
    .setVersion('1.0')
    .addTag('Products', 'Product catalog management')
    .addTag('Cart', 'Shopping cart operations')
    .addTag('Orders', 'Order processing and history')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'ShopNest API Docs',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 30px 0; }
      .swagger-ui .info .title { color: #6366f1; }
    `,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
