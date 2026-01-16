import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'The Dark Knight', description: 'Title of the movie' })
  @IsString()
  title: string;

  @ApiProperty({ required: false, example: 'A superhero crime thriller directed by Christopher Nolan.', description: 'Movie description or plot summary' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, example: 'Christopher Nolan', description: 'Director of the movie' })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiProperty({ required: false, example: 2008, description: 'Year the movie was released (1888-present)' })
  @IsOptional()
  @IsInt()
  @Min(1888)
  @Max(3000)
  releaseYear?: number;

  @ApiProperty({ required: false, type: [String], example: ['Action', 'Crime', 'Drama'], description: 'List of genres' })
  @IsOptional()
  genres?: string[];

  @ApiProperty({ required: false, example: 'https://example.com/movie-poster.jpg', description: 'URL or base64 data URL of the movie cover image' })
  @IsOptional()
  @IsString()
  coverUrl?: string;
}
