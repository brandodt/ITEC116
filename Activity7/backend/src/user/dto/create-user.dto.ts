import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Alex Rivera', description: 'Name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'alex@demo.local', description: 'Email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, example: 'Manager', description: 'Role or job title' })
  @IsOptional()
  @IsString()
  role?: string;
}
