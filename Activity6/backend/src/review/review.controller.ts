import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiTags('reviews')
@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('movies/:movieId/reviews')
  @ApiOperation({ summary: 'Create a review for a movie', description: 'Adds a new review to a specific movie' })
  @ApiParam({ name: 'movieId', description: 'Movie ID (MongoDB ObjectId)' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  create(
    @Param('movieId') movieId: string,
    @Body() dto: Omit<CreateReviewDto, 'movieId'>,
  ) {
    return this.reviewService.create({ ...dto, movieId });
  }

  @Get('movies/:movieId/reviews')
  @ApiOperation({ summary: 'Get all reviews for a movie', description: 'Retrieves all reviews for a specific movie' })
  @ApiParam({ name: 'movieId', description: 'Movie ID (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'List of reviews retrieved successfully' })
  findByMovie(@Param('movieId') movieId: string) {
    return this.reviewService.findByMovie(movieId);
  }

  @Get('reviews/:id')
  @ApiOperation({ summary: 'Get a review by ID', description: 'Retrieves a single review by its ID' })
  @ApiParam({ name: 'id', description: 'Review ID (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'Review found' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch('reviews/:id')
  @ApiOperation({ summary: 'Update a review', description: 'Updates an existing review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewService.update(id, dto);
  }

  @Delete('reviews/:id')
  @ApiOperation({ summary: 'Delete a review', description: 'Permanently deletes a review' })
  @ApiParam({ name: 'id', description: 'Review ID (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
