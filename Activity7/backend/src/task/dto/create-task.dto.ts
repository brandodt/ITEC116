import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsMongoId } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Create project wireframes', description: 'Title of the task' })
  @IsString()
  title: string;

  @ApiProperty({ required: false, example: 'Initial layout and user flow for key pages.', description: 'Task description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, example: 'todo', enum: ['todo', 'in_progress', 'done'], description: 'Task status' })
  @IsOptional()
  @IsEnum(['todo', 'in_progress', 'done'])
  status?: string;

  @ApiProperty({ required: false, example: '2026-01-18', description: 'Due date in YYYY-MM-DD format' })
  @IsOptional()
  @IsString()
  dueDate?: string;

  @ApiProperty({ required: false, example: '507f1f77bcf86cd799439011', description: 'MongoDB ObjectId of the project' })
  @IsOptional()
  @IsMongoId()
  projectId?: string;

  @ApiProperty({ required: false, example: '507f1f77bcf86cd799439012', description: 'MongoDB ObjectId of the assigned user' })
  @IsOptional()
  @IsMongoId()
  assigneeUserId?: string;
}
