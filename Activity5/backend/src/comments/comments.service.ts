import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
    constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) { }

    async create(postId: string, createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
        const comment = new this.commentModel({
            ...createCommentDto,
            postId: new Types.ObjectId(postId),
            userId: new Types.ObjectId(userId),
        });
        return comment.save();
    }

    async findByPost(postId: string): Promise<Comment[]> {
        return this.commentModel
            .find({ postId: new Types.ObjectId(postId) })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .exec()
            .then(comments => {
                // Transform the populated userId to include id field
                return comments.map(comment => {
                    const plainComment = comment.toObject();
                    if (plainComment.userId && (plainComment.userId as any)._id) {
                        (plainComment.userId as any).id = (plainComment.userId as any)._id.toString();
                    }
                    return plainComment;
                });
            });
    }

    async remove(id: string, userId: string): Promise<void> {
        const comment = await this.commentModel.findById(id);

        if (!comment) {
            throw new NotFoundException(`Comment with ID ${id} not found`);
        }

        if (comment.userId.toString() !== userId) {
            throw new NotFoundException('Unauthorized');
        }

        await this.commentModel.findByIdAndDelete(id);
    }
}
