import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post(':postId')
    @UseGuards(JwtAuthGuard)
    create(
        @Param('postId') postId: string,
        @Body() createCommentDto: CreateCommentDto,
        @Request() req: any,
    ) {
        return this.commentsService.create(postId, createCommentDto, req.user.id);
    }

    @Get('post/:postId')
    findByPost(@Param('postId') postId: string) {
        return this.commentsService.findByPost(postId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @Request() req: any) {
        return this.commentsService.remove(id, req.user.id);
    }
}
