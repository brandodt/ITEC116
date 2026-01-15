import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1888)
  @Max(3000)
  releaseYear?: number;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  genres?: string[];
}
