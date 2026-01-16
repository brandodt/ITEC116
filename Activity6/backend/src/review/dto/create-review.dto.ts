import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsMongoId, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'MongoDB ObjectId of the movie being reviewed' })
  @IsMongoId()
  movieId: string;

  @ApiProperty({ example: 'John Doe', description: 'Name of the reviewer' })
  @IsString()
  reviewerName: string;

  @ApiProperty({ minimum: 1, maximum: 5, example: 5, description: 'Rating from 1 to 5 stars' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ required: false, example: 'An absolutely phenomenal movie with stunning visuals!', description: 'Optional review comment' })
  @IsOptional()
  @IsString()
  comment?: string;
}
