import { ApiProperty } from '@nestjs/swagger';
import { 
  IsOptional, 
  IsString, 
  IsNumber,
  IsArray,
  Min,
  Max
} from 'class-validator';

export class UpdateBookDto {
  @ApiProperty({
    example: 'Pride and Prejudice',
    description: 'The title of the book',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 1813,
    description: 'The year the book was published',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1000)
  @Max(new Date().getFullYear())
  publicationYear?: number;

  @ApiProperty({
    example: 'A romantic novel of manners set in early 19th-century England.',
    description: 'A summary of the book',
    required: false,
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({
    example: '978-1503290563',
    description: 'The ISBN (International Standard Book Number)',
    required: false,
  })
  @IsOptional()
  @IsString()
  ISBN?: string;

  @ApiProperty({
    example: '60d5ec9ff682727a12897d5c',
    description: 'The ID of the book author',
    required: false,
  })
  @IsOptional()
  @IsString()
  authorId?: string;

  @ApiProperty({
    example: ['60d5ec9ff682727a12897d5e', '60d5ec9ff682727a12897d5f'],
    description: 'Array of category IDs this book belongs to',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];
}
