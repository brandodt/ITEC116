import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserResponseDto {
    @ApiProperty({
        description: 'User unique identifier',
        example: '507f1f77bcf86cd799439011',
    })
    id: string;

    @ApiProperty({
        description: 'User email address',
        example: 'john.doe@example.com',
    })
    email: string;

    @ApiProperty({
        description: 'User full name',
        example: 'John Doe',
    })
    name: string;

    @ApiProperty({
        description: 'User creation timestamp',
        example: '2024-01-15T10:30:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'User last update timestamp',
        example: '2024-01-15T10:30:00.000Z',
    })
    updatedAt: Date;

    @Exclude()
    password: string;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
}
