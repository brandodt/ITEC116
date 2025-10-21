import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Science Fiction',
    description: 'The name of the category',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Fiction based on scientific discoveries or advanced technology',
    description: 'The description of the category',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
