import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mongodb',
            url: process.env.MONGODB_URI,
            database: 'taskmanager',
            entities: [Task],
            synchronize: true,
            autoLoadEntities: true, // Add this to ensure entities are loaded
        }),
        TasksModule,
    ],
})
export class AppModule { }
