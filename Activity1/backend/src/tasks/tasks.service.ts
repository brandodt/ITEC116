import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
    ) {
        this.logger.log('TasksService initialized');
    }

    async create(createTaskDto: CreateTaskDto): Promise<Task> {
        this.logger.log(`Creating task: ${JSON.stringify(createTaskDto)}`);
        const task = this.taskRepository.create({
            ...createTaskDto,
            createdAt: new Date(),
        });
        const savedTask = await this.taskRepository.save(task);
        this.logger.log(`Task created with ID: ${savedTask.id}`);
        return savedTask;
    }

    async findAll(): Promise<Task[]> {
        this.logger.log('Fetching all tasks');
        const tasks = await this.taskRepository.find();
        this.logger.log(`Found ${tasks.length} tasks`);
        return tasks;
    }

    async findOne(id: string): Promise<Task> {
        try {
            this.logger.log(`Fetching task with ID: ${id}`);
            // Check if the id is a valid ObjectId
            if (!ObjectId.isValid(id)) {
                this.logger.warn(`Invalid ObjectId format: ${id}`);
                throw new NotFoundException(`Task with ID ${id} not found (invalid format)`);
            }

            // Use a more direct query approach with ObjectId
            const objectId = new ObjectId(id);
            const task = await this.taskRepository.findOneBy({ _id: objectId });

            if (!task) {
                this.logger.warn(`Task with ID ${id} not found`);
                throw new NotFoundException(`Task with ID ${id} not found`);
            }
            return task;
        } catch (error) {
            this.logger.error(`Error finding task: ${error.message}`);
            throw error;
        }
    }

    async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
        try {
            this.logger.log(`Updating task ${id} with: ${JSON.stringify(updateTaskDto)}`);

            // Use findOneBy with _id for MongoDB
            if (!ObjectId.isValid(id)) {
                this.logger.warn(`Invalid ObjectId format for update: ${id}`);
                throw new NotFoundException(`Task with ID ${id} not found (invalid format)`);
            }

            const objectId = new ObjectId(id);
            const task = await this.taskRepository.findOneBy({ _id: objectId });

            if (!task) {
                this.logger.warn(`Task with ID ${id} not found for update`);
                throw new NotFoundException(`Task with ID ${id} not found`);
            }

            // Log the state before update
            this.logger.log(`Current task state before update: ${JSON.stringify(task)}`);

            // Update only the fields that are provided in the updateTaskDto
            if (updateTaskDto.title !== undefined) {
                task.title = updateTaskDto.title;
            }

            if (updateTaskDto.description !== undefined) {
                task.description = updateTaskDto.description;
            }

            if (updateTaskDto.completed !== undefined) {
                // Ensure completed is stored as a boolean
                task.completed = Boolean(updateTaskDto.completed);
                this.logger.log(`Setting completed status to: ${task.completed} (${typeof task.completed})`);
            }

            // Always update the updatedAt timestamp
            task.updatedAt = new Date();

            // Save the updated task
            const updatedTask = await this.taskRepository.save(task);
            this.logger.log(`Task ${id} updated successfully: ${JSON.stringify(updatedTask)}`);
            return updatedTask;
        } catch (error) {
            this.logger.error(`Error updating task: ${error.message}`);
            throw error;
        }
    }

    async remove(id: string): Promise<void> {
        try {
            this.logger.log(`Deleting task with ID: ${id}`);

            if (!ObjectId.isValid(id)) {
                this.logger.warn(`Invalid ObjectId format for deletion: ${id}`);
                throw new NotFoundException(`Task with ID ${id} not found (invalid format)`);
            }

            const objectId = new ObjectId(id);
            const result = await this.taskRepository.delete({ _id: objectId });

            if (result.affected === 0) {
                this.logger.warn(`Task with ID ${id} not found for deletion`);
                throw new NotFoundException(`Task with ID ${id} not found`);
            }

            this.logger.log(`Task ${id} deleted successfully`);
        } catch (error) {
            this.logger.error(`Error deleting task: ${error.message}`);
            throw error;
        }
    }
}
