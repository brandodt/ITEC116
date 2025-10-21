import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Export the Author document type for use in services and seeders
export type AuthorDocument = Author & Document;

@Schema()
export class Author {
  @Prop({ required: true })
  name: string;

  @Prop()
  country?: string;

  @Prop()
  bio?: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
