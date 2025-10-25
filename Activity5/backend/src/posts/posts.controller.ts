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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createPostDto: CreatePostDto, @Request() req: any) {
        return this.postsService.create(createPostDto, req.user.id);
    }

    @Get()
    findAll() {
        return this.postsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
        @Request() req: any,
    ) {
        return this.postsService.update(id, updatePostDto, req.user.id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @Request() req: any) {
        return this.postsService.remove(id, req.user.id);
    }
}
