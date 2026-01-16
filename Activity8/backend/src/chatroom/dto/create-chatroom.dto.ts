import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateChatroomDto {
  @ApiProperty({ example: 'General Chat', description: 'Name of the chatroom' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'A place for general discussions', description: 'Chatroom description' })
  @IsOptional()
  @IsString()
  description?: string;
}
