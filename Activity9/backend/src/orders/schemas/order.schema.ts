import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type OrderDocument = Order & Document;

@Schema()
export class OrderItem {
  @ApiProperty({ description: 'Product ID reference' })
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @ApiProperty({ example: 'Wireless Headphones', description: 'Product name at time of order' })
  @Prop({ required: true })
  productName: string;

  @ApiProperty({ example: 79.99, description: 'Product price at time of order' })
  @Prop({ required: true })
  price: number;

  @ApiProperty({ example: 2, description: 'Quantity ordered' })
  @Prop({ required: true, min: 1 })
  quantity: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Product image URL' })
  @Prop({ required: true })
  image: string;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @ApiProperty({ example: 'session_abc123', description: 'Session or user identifier' })
  @Prop({ required: true })
  sessionId: string;

  @ApiProperty({ type: [OrderItem], description: 'Items in the order' })
  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @ApiProperty({ example: 159.98, description: 'Subtotal before tax and shipping' })
  @Prop({ required: true })
  subtotal: number;

  @ApiProperty({ example: 0, description: 'Shipping cost' })
  @Prop({ required: true })
  shipping: number;

  @ApiProperty({ example: 12.80, description: 'Tax amount' })
  @Prop({ required: true })
  tax: number;

  @ApiProperty({ example: 172.78, description: 'Total order amount' })
  @Prop({ required: true })
  total: number;

  @ApiProperty({ example: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] })
  @Prop({ 
    required: true, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending' 
  })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
