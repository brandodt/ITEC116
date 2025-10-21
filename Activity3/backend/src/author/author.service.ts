import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author, AuthorDocument } from './schemas/author.schema';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const createdAuthor = new this.authorModel(createAuthorDto);
    return createdAuthor.save();
  }

  async findAll(): Promise<Author[]> {
    return this.authorModel.find().exec();
  }

  async findOne(id: string): Promise<Author> {
    const author = await this.authorModel.findById(id).exec();
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const updatedAuthor = await this.authorModel
      .findByIdAndUpdate(id, updateAuthorDto, { new: true })
      .exec();
    
    if (!updatedAuthor) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    
    return updatedAuthor;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.authorModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    
    return { success: true, message: `Author with ID ${id} successfully deleted` };
  }
}
