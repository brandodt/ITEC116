import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author, AuthorDocument } from '../author/schemas/author.schema';
import { Category, CategoryDocument } from '../category/schemas/category.schema';
import { Book, BookDocument } from '../book/schemas/book.schema';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  async onModuleInit() {
    const authorsCount = await this.authorModel.countDocuments().exec();
    const categoriesCount = await this.categoryModel.countDocuments().exec();
    
    if (authorsCount === 0 && categoriesCount === 0) {
      await this.seed();
      console.log('Database seeded successfully');
    } else {
      console.log('Database already contains data, skipping seed');
    }
  }

  async seed() {
    // Create authors
    const authors = await this.authorModel.create([
      {
        name: 'J.K. Rowling',
        biography: 'British author best known for the Harry Potter series',
        dateOfBirth: new Date('1965-07-31'),
      },
      {
        name: 'George Orwell',
        biography: 'English novelist known for Animal Farm and 1984',
        dateOfBirth: new Date('1903-06-25'),
      },
      {
        name: 'Jane Austen',
        biography: 'English novelist known for her social commentary',
        dateOfBirth: new Date('1775-12-16'),
      },
    ]);

    // Create categories
    const categories = await this.categoryModel.create([
      {
        name: 'Fiction',
        description: 'Literary works based on imagination',
      },
      {
        name: 'Fantasy',
        description: 'Fiction involving magical or supernatural elements',
      },
      {
        name: 'Dystopian',
        description: 'Fiction set in a dark, oppressive society',
      },
      {
        name: 'Classic',
        description: 'Books that have withstood the test of time',
      },
      {
        name: 'Romance',
        description: 'Stories focused on romantic relationships',
      },
    ]);

    // Create books
    await this.bookModel.create([
      {
        title: 'Harry Potter and the Philosopher\'s Stone',
        publicationYear: 1997,
        summary: 'The first book in the Harry Potter series',
        ISBN: '978-0747532743',
        author: authors[0]._id,
        categories: [categories[0]._id, categories[1]._id],
      },
      {
        title: '1984',
        publicationYear: 1949,
        summary: 'A dystopian novel about totalitarianism',
        ISBN: '978-0451524935',
        author: authors[1]._id,
        categories: [categories[0]._id, categories[2]._id, categories[3]._id],
      },
      {
        title: 'Pride and Prejudice',
        publicationYear: 1813,
        summary: 'A romantic novel about societal expectations',
        ISBN: '978-0141439518',
        author: authors[2]._id,
        categories: [categories[0]._id, categories[3]._id, categories[4]._id],
      },
    ]);
  }
}
