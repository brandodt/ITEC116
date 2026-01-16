import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop()
  email?: string;

  @Prop()
  role?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
