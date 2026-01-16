import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new movie', description: 'Creates a new movie entry in the database' })
  @ApiResponse({ status: 201, description: 'Movie created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() dto: CreateMovieDto) {
    return this.movieService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies', description: 'Retrieves a list of all movies with their average ratings' })
  @ApiResponse({ status: 200, description: 'List of movies retrieved successfully' })
  findAll() {
    return this.movieService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID', description: 'Retrieves a single movie by its ID' })
  @ApiParam({ name: 'id', description: 'Movie ID (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'Movie found' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a movie', description: 'Updates an existing movie by ID' })
  @ApiParam({ name: 'id', description: 'Movie ID (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'Movie updated successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  update(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
    return this.movieService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie', description: 'Permanently deletes a movie and all its reviews' })
  @ApiParam({ name: 'id', description: 'Movie ID (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'Movie deleted successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  remove(@Param('id') id: string) {
    return this.movieService.remove(id);
  }
}
