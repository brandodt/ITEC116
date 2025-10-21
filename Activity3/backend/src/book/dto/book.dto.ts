import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// --- CREATE BOOK DTO ---
export class CreateBookDto {
  @ApiProperty({ example: 'The Silent Code', description: 'The title of the book' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'MongoDB ObjectId of the Author' })
  @IsNotEmpty()
  @IsMongoId()
  author: string; // This is the ID of the Author document

  @ApiProperty({ example: 2024, description: 'The year of publication' })
  @IsNotEmpty()
  @IsNumber()
  publicationYear: number;

  @ApiProperty({ type: [String], description: 'Array of MongoDB ObjectIds for Categories' })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  categories?: string[]; // Array of Category IDs

  @ApiProperty({ example: 'A gripping tale...', description: 'A short summary of the book.' })
  @IsOptional()
  @IsString()
  summary?: string;
}

// --- UPDATE BOOK DTO ---
export class UpdateBookDto {
  @ApiProperty({ example: 'The Silent Code', description: 'The title of the book', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'MongoDB ObjectId of the Author', required: false })
  @IsOptional()
  @IsMongoId()
  author?: string;

  @ApiProperty({ example: 2024, description: 'The year of publication', required: false })
  @IsOptional()
  @IsNumber()
  publicationYear?: number;

  @ApiProperty({ type: [String], description: 'Array of MongoDB ObjectIds for Categories', required: false })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  categories?: string[];

  @ApiProperty({ example: 'A gripping tale...', description: 'A short summary of the book.', required: false })
  @IsOptional()
  @IsString()
  summary?: string;
}
