import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdatePostDto {
    @ApiProperty({
        description: 'Post title',
        example: 'Getting Started with NestJS - Updated',
        required: false,
    })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({
        description: 'Post content',
        example: 'Updated content about NestJS...',
        required: false,
    })
    @IsString()
    @IsOptional()
    content?: string;

    @ApiProperty({
        description: 'Post tags',
        example: ['nestjs', 'typescript', 'backend', 'tutorial'],
        required: false,
        type: [String],
    })
    @IsArray()
    @IsOptional()
    tags?: string[];
}
