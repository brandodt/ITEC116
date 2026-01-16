import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CartDocument = Cart & Document;

@Schema()
export class CartItem {
  @ApiProperty({ description: 'Product ID reference' })
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @ApiProperty({ example: 2, description: 'Quantity of the product' })
  @Prop({ required: true, min: 1 })
  quantity: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart {
  @ApiProperty({ example: 'session_abc123', description: 'Session or user identifier' })
  @Prop({ required: true })
  sessionId: string;

  @ApiProperty({ type: [CartItem], description: 'Items in the cart' })
  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
