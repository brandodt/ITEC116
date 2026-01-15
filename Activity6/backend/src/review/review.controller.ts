import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiTags('reviews')
@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('movies/:movieId/reviews')
  create(
    @Param('movieId') movieId: string,
    @Body() dto: Omit<CreateReviewDto, 'movieId'>,
  ) {
    return this.reviewService.create({ ...dto, movieId });
  }

  @Get('movies/:movieId/reviews')
  findByMovie(@Param('movieId') movieId: string) {
    return this.reviewService.findByMovie(movieId);
  }

  @Get('reviews/:id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch('reviews/:id')
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewService.update(id, dto);
  }

  @Delete('reviews/:id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
