import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({
    timestamps: true,
})
export class Comment {
    @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
    postId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    content: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
