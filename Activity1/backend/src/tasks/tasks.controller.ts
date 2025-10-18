import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    HttpCode,
    Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
    private readonly logger = new Logger(TasksController.name);

    constructor(private readonly tasksService: TasksService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new task' })
    @ApiBody({ type: CreateTaskDto })
    @ApiResponse({
        status: 201,
        description: 'Task created successfully',
        type: Task,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid input data',
    })
    async create(@Body() createTaskDto: CreateTaskDto) {
        this.logger.log(`Received request to create task: ${JSON.stringify(createTaskDto)}`);
        return this.tasksService.create(createTaskDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tasks' })
    @ApiResponse({
        status: 200,
        description: 'List of all tasks',
        type: [Task],
    })
    findAll() {
        this.logger.log('Received request to get all tasks');
        return this.tasksService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a task by ID' })
    @ApiParam({
        name: 'id',
        description: 'Task ID (MongoDB ObjectId)',
        example: '507f1f77bcf86cd799439011',
    })
    @ApiResponse({
        status: 200,
        description: 'Task found',
        type: Task,
    })
    @ApiResponse({
        status: 404,
        description: 'Task not found',
    })
    findOne(@Param('id') id: string) {
        this.logger.log(`Received request to get task with ID: ${id}`);
        return this.tasksService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a task' })
    @ApiParam({
        name: 'id',
        description: 'Task ID (MongoDB ObjectId)',
        example: '507f1f77bcf86cd799439011',
    })
    @ApiBody({ type: UpdateTaskDto })
    @ApiResponse({
        status: 200,
        description: 'Task updated successfully',
        type: Task,
    })
    @ApiResponse({
        status: 404,
        description: 'Task not found',
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid input data',
    })
    async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
        this.logger.log(`Received request to update task ${id} with: ${JSON.stringify(updateTaskDto)}`);

        try {
            const result = await this.tasksService.update(id, updateTaskDto);
            this.logger.log(`Successfully updated task ${id}`);
            return result;
        } catch (error) {
            this.logger.error(`Error updating task ${id}: ${error.message}`);
            throw error;
        }
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete a task' })
    @ApiParam({
        name: 'id',
        description: 'Task ID (MongoDB ObjectId)',
        example: '507f1f77bcf86cd799439011',
    })
    @ApiResponse({
        status: 204,
        description: 'Task deleted successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Task not found',
    })
    remove(@Param('id') id: string) {
        this.logger.log(`Received request to delete task with ID: ${id}`);
        return this.tasksService.remove(id);
    }
}
