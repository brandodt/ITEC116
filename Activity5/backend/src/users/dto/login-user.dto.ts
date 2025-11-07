import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
    @ApiProperty({
        description: 'User email address',
        example: 'john.doe@example.com',
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'SecurePass123',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
