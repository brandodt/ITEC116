import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<MovieDocument>) {}

  async create(dto: CreateMovieDto): Promise<Movie> {
    const created = new this.movieModel({
      ...dto,
      genres: dto.genres ?? [],
    });
    return created.save();
  }

  async findAll(): Promise<Movie[]> {
    return this.movieModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieModel.findById(id).exec();
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async update(id: string, dto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.movieModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async remove(id: string): Promise<void> {
    const result = await this.movieModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Movie not found');
  }

  async updateRating(movieId: string, averageRating: number, reviewCount: number) {
    await this.movieModel
      .findByIdAndUpdate(movieId, { averageRating, reviewCount })
      .exec();
  }
}
