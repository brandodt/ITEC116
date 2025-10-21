import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Export the Category document type for use in services and seeders
export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
