import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    title: string;

    @IsOptional()
    @IsString()
    description?: string;
}
