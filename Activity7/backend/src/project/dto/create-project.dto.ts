import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Website Redesign', description: 'Name of the project' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'Refresh landing page and improve navigation.', description: 'Project description' })
  @IsOptional()
  @IsString()
  description?: string;
}
