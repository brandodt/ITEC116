import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, IsMongoId } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ description: 'Title of the book', example: 'The Great Gatsby' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Year of publication', example: 1925 })
  @IsNotEmpty()
  @IsNumber()
  publicationYear: number;

  @ApiProperty({ description: 'Book summary', required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ description: 'Author ID (MongoDB ObjectID)' })
  @IsNotEmpty()
  @IsMongoId()
  author: string;

  @ApiProperty({ description: 'Category IDs (array of MongoDB ObjectIDs)', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  categories?: string[];
}

export class UpdateBookDto {
  @ApiProperty({ description: 'Title of the book', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Year of publication', required: false })
  @IsOptional()
  @IsNumber()
  publicationYear?: number;

  @ApiProperty({ description: 'Book summary', required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ description: 'Author ID (MongoDB ObjectID)', required: false })
  @IsOptional()
  @IsMongoId()
  author?: string;

  @ApiProperty({ description: 'Category IDs (array of MongoDB ObjectIDs)', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  categories?: string[];
}
