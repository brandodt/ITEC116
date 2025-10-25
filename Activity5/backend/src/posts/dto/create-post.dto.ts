import { IsString, IsNotEmpty, IsArray, IsOptional, MaxLength } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    tags?: string[];
}
