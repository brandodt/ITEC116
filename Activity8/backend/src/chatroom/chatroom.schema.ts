import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatroomDocument = Chatroom & Document;

@Schema({ timestamps: true })
export class Chatroom {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: 0 })
  messageCount?: number;

  @Prop({ default: 0 })
  participantCount?: number;
}

export const ChatroomSchema = SchemaFactory.createForClass(Chatroom);
