import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    content: string;
}
