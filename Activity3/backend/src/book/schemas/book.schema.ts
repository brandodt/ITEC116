import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Author } from '../../author/schemas/author.schema';
import { Category } from '../../category/schemas/category.schema';

// Export the Book document type for use in services and seeders
export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  publicationYear: number;

  @Prop()
  summary?: string;
  
  // Relationship to Author
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Author', required: true })
  author: Author; 

  // Relationship to Categories
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }] })
  categories: Category[]; 
}

export const BookSchema = SchemaFactory.createForClass(Book);
