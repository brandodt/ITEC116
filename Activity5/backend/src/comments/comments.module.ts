import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment, CommentSchema } from './entities/comment.entity';

@Module({
    imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])],
    controllers: [CommentsController],
    providers: [CommentsService],
})
export class CommentsModule { }
