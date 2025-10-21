import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto'; // Fixed import path

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async findAll(): Promise<BookDocument[]> {
    // Using space-separated string for populate
    return this.bookModel.find().populate('author categories').exec();
  }

  async findOne(id: string): Promise<BookDocument> {
    const book = await this.bookModel.findById(id).populate('author categories').exec();
    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
    return book;
  }

  async create(createBookDto: CreateBookDto): Promise<BookDocument> {
    const createdBook = new this.bookModel(createBookDto);
    const savedBook = await createdBook.save();
    return savedBook.populate('author categories');
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<BookDocument> {
    const existingBook = await this.bookModel
      .findByIdAndUpdate(id, { $set: updateBookDto }, { new: true })
      .populate('author categories')
      .exec();

    if (!existingBook) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
    return existingBook;
  }

  async remove(id: string): Promise<any> {
    const result = await this.bookModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
    return { message: 'Book deleted successfully' };
  }
}
