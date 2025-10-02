import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors(); // Enable CORS for frontend connection
    app.useGlobalPipes(new ValidationPipe());

    // Verify MongoDB connection and list collections
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        const client = new MongoClient(mongoUri);
        await client.connect();
        console.log('MongoDB connection successful!');

        const db = client.db();
        const collections = await db.listCollections().toArray();

        if (collections.length === 0) {
            console.log('No collections found in the database. Collections will be created when you add your first task.');
        } else {
            console.log('Collections in database:');
            collections.forEach(collection => {
                console.log(`- ${collection.name}`);
            });
        }

        await client.close();
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }

    await app.listen(3001);
    console.log(`Application is running on: http://localhost:3001`);
}
bootstrap();
