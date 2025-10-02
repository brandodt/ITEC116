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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
    private readonly logger = new Logger(TasksController.name);

    constructor(private readonly tasksService: TasksService) { }

    @Post()
    async create(@Body() createTaskDto: CreateTaskDto) {
        this.logger.log(`Received request to create task: ${JSON.stringify(createTaskDto)}`);
        return this.tasksService.create(createTaskDto);
    }

    @Get()
    findAll() {
        this.logger.log('Received request to get all tasks');
        return this.tasksService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        this.logger.log(`Received request to get task with ID: ${id}`);
        return this.tasksService.findOne(id);
    }

    @Put(':id')
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
    remove(@Param('id') id: string) {
        this.logger.log(`Received request to delete task with ID: ${id}`);
        return this.tasksService.remove(id);
    }
}
