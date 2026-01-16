import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @ApiProperty({ example: 'Wireless Headphones', description: 'Product name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'Premium wireless headphones with noise cancellation', description: 'Product description' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ example: 79.99, description: 'Product price in USD' })
  @Prop({ required: true, min: 0 })
  price: number;

  @ApiProperty({ example: 15, description: 'Available stock quantity' })
  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @ApiProperty({ example: 'Electronics', description: 'Product category' })
  @Prop({ required: true })
  category: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Product image URL', required: false })
  @Prop({ default: '' })
  image: string;

  @ApiProperty({ example: true, description: 'Whether product is active' })
  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
