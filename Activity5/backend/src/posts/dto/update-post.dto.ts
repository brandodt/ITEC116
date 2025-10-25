import { IsString, IsOptional, IsArray, MaxLength } from 'class-validator';

export class UpdatePostDto {
    @IsString()
    @IsOptional()
    @MaxLength(200)
    title?: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    tags?: string[];
}
