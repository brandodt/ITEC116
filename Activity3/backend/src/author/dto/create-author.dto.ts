import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({
    example: 'Jane Austen',
    description: 'The name of the author',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'An English novelist known primarily for her six major novels.',
    description: 'The biography of the author',
    required: false,
  })
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiProperty({
    example: '1775-12-16',
    description: 'The date of birth of the author in ISO format',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}
