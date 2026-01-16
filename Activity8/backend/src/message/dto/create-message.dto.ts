import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the message sender' })
  @IsString()
  sender: string;

  @ApiProperty({ example: 'Hello everyone!', description: 'Message content' })
  @IsString()
  content: string;
}
