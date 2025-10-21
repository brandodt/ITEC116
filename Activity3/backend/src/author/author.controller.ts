import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Author } from './schemas/author.schema';

@ApiTags('authors')
@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new author' })
  @ApiResponse({ 
    status: 201, 
    description: 'The author has been successfully created.',
    type: Author 
  })
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all authors' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all authors.',
    type: [Author]
  })
  findAll() {
    return this.authorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get author by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the author with the specified ID.',
    type: Author
  })
  @ApiResponse({ status: 404, description: 'Author not found.' })
  findOne(@Param('id') id: string) {
    return this.authorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update author by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The author has been successfully updated.',
    type: Author
  })
  @ApiResponse({ status: 404, description: 'Author not found.' })
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete author by ID' })
  @ApiResponse({ status: 204, description: 'The author has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Author not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.authorService.remove(id);
  }
}
