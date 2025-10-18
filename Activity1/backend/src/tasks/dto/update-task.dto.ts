import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
    @ApiProperty({
        description: 'The title of the task',
        example: 'Complete project documentation',
        maxLength: 100,
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    title?: string;

    @ApiProperty({
        description: 'Description of the task',
        example: 'Write comprehensive API documentation for all endpoints',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: 'Whether the task is completed',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    completed?: boolean;
}
