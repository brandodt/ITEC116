import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { MovieService } from '../movie/movie.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private readonly movieService: MovieService,
  ) {}

  async create(dto: CreateReviewDto): Promise<Review> {
    const created = new this.reviewModel({
      movie: dto.movieId,
      reviewerName: dto.reviewerName,
      rating: dto.rating,
      comment: dto.comment,
    });
    const review = await created.save();
    await this.recalculateMovieRating(dto.movieId);
    return review;
  }

  async findByMovie(movieId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ movie: movieId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async update(id: string, dto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!review) throw new NotFoundException('Review not found');

    const movieId = (dto.movieId as string) ?? review.movie.toString();
    await this.recalculateMovieRating(movieId);
    return review;
  }

  async remove(id: string): Promise<void> {
    const review = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!review) throw new NotFoundException('Review not found');
    await this.recalculateMovieRating(review.movie.toString());
  }

  private async recalculateMovieRating(movieId: string) {
    const reviews = await this.reviewModel.find({ movie: movieId }).exec();
    const reviewCount = reviews.length;
    const averageRating =
      reviewCount === 0
        ? 0
        : reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

    await this.movieService.updateRating(movieId, averageRating, reviewCount);
  }
}
