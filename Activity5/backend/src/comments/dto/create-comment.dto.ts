import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty({
        description: 'Comment content',
        example: 'Great article! Very helpful.',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    content: string;
}
