import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  director?: string;

  @Prop()
  releaseYear?: number;

  @Prop({ type: [String], default: [] })
  genres: string[];

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  reviewCount: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
