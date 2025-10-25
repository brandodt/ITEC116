import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({
    timestamps: true,
})
export class Post {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
