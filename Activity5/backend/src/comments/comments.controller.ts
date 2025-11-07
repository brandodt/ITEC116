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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('comments')
@Controller()
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    // Nested route: POST /posts/:postId/comments
    @Post('posts/:postId/comments')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Add a comment to a post' })
    @ApiParam({ name: 'postId', description: 'Post ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
    @ApiBody({ type: CreateCommentDto })
    @ApiResponse({ status: 201, description: 'Comment added successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    create(
        @Param('postId') postId: string,
        @Body() createCommentDto: CreateCommentDto,
        @Request() req: any,
    ) {
        return this.commentsService.create(postId, createCommentDto, req.user.id);
    }

    // Nested route: GET /posts/:postId/comments
    @Get('posts/:postId/comments')
    @ApiOperation({ summary: 'Get all comments for a post' })
    @ApiParam({ name: 'postId', description: 'Post ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
    @ApiResponse({ status: 200, description: 'List of comments' })
    findByPost(@Param('postId') postId: string) {
        return this.commentsService.findByPost(postId);
    }

    // Nested route: DELETE /posts/:postId/comments/:id
    @Delete('posts/:postId/comments/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete a comment' })
    @ApiParam({ name: 'postId', description: 'Post ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
    @ApiParam({ name: 'id', description: 'Comment ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439012' })
    @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Comment not found' })
    remove(@Param('id') id: string, @Request() req: any) {
        return this.commentsService.remove(id, req.user.id);
    }
}
