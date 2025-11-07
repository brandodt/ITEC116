import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a new blog post' })
    @ApiBody({ type: CreatePostDto })
    @ApiResponse({ status: 201, description: 'Post created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(@Body() createPostDto: CreatePostDto, @Request() req: any) {
        return this.postsService.create(createPostDto, req.user.id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all blog posts' })
    @ApiResponse({ status: 200, description: 'List of all posts' })
    findAll() {
        return this.postsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a post by ID' })
    @ApiParam({ name: 'id', description: 'Post ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
    @ApiResponse({ status: 200, description: 'Post found' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update a post' })
    @ApiParam({ name: 'id', description: 'Post ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
    @ApiBody({ type: UpdatePostDto })
    @ApiResponse({ status: 200, description: 'Post updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    update(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
        @Request() req: any,
    ) {
        return this.postsService.update(id, updatePostDto, req.user.id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete a post' })
    @ApiParam({ name: 'id', description: 'Post ID (MongoDB ObjectId)', example: '507f1f77bcf86cd799439011' })
    @ApiResponse({ status: 200, description: 'Post deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    remove(@Param('id') id: string, @Request() req: any) {
        return this.postsService.remove(id, req.user.id);
    }
}
