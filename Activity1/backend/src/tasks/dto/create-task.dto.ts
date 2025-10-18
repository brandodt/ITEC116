import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
    @ApiProperty({
        description: 'The title of the task',
        example: 'Complete project documentation',
        maxLength: 100,
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    title: string;

    @ApiProperty({
        description: 'Optional description of the task',
        example: 'Write comprehensive API documentation for all endpoints',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;
}
