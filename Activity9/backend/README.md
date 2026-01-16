# Activity 9: ShopNest E-Commerce API

A RESTful API for a mini e-commerce system built with NestJS and MongoDB.

## Features

- **Products Module**: CRUD operations for product catalog with auto-seeding
- **Cart Module**: Shopping cart with session-based management
- **Orders Module**: Checkout with stock validation and order history
- **Swagger Documentation**: Interactive API documentation

## Tech Stack

- **Framework**: NestJS 10
- **Database**: MongoDB with Mongoose ODM
- **Documentation**: Swagger/OpenAPI 3.0
- **Validation**: class-validator & class-transformer

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your MongoDB connection string
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### API Documentation

Once running, access Swagger UI at:
```
http://localhost:3000/api/docs
```

## API Endpoints

### Products `/api/products`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all products (with optional filters) |
| GET | `/:id` | Get product by ID |
| GET | `/categories` | Get all categories |
| POST | `/` | Create new product |
| PATCH | `/:id` | Update product |
| DELETE | `/:id` | Delete product |

### Cart `/api/cart`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get cart contents |
| POST | `/add` | Add item to cart |
| PATCH | `/update` | Update item quantity |
| DELETE | `/remove/:productId` | Remove item from cart |
| DELETE | `/clear` | Clear entire cart |
| POST | `/validate` | Validate cart before checkout |

### Orders `/api/orders`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/checkout` | Create order from cart |
| GET | `/` | Get all orders |
| GET | `/stats` | Get order statistics |
| GET | `/:id` | Get order by ID |
| PATCH | `/:id/status` | Update order status |

## Session Management

The API uses a session-based approach for cart and order tracking. Include the `x-session-id` header in requests:

```
x-session-id: your-session-id
```

If not provided, a default session is used.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | - |

## Project Structure

```
src/
├── cart/
│   ├── dto/
│   ├── schemas/
│   ├── cart.controller.ts
│   ├── cart.module.ts
│   └── cart.service.ts
├── orders/
│   ├── dto/
│   ├── schemas/
│   ├── orders.controller.ts
│   ├── orders.module.ts
│   └── orders.service.ts
├── products/
│   ├── dto/
│   ├── schemas/
│   ├── products.controller.ts
│   ├── products.module.ts
│   └── products.service.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

## License

UNLICENSED
