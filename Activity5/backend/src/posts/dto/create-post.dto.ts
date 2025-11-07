import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class CreatePostDto {
    @ApiProperty({
        description: 'Post title',
        example: 'Getting Started with NestJS',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'Post content',
        example: 'NestJS is a progressive Node.js framework...',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({
        description: 'Post tags',
        example: ['nestjs', 'typescript', 'backend'],
        required: false,
        type: [String],
    })
    @IsArray()
    @IsOptional()
    tags?: string[];
}
