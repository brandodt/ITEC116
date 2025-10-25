import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) { }

    async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
        const post = new this.postModel({
            ...createPostDto,
            userId: new Types.ObjectId(userId),
        });
        return post.save();
    }

    async findAll(): Promise<Post[]> {
        return this.postModel
            .find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .exec()
            .then(posts => {
                // Transform the populated userId to include id field
                return posts.map(post => {
                    const plainPost = post.toObject();
                    if (plainPost.userId && (plainPost.userId as any)._id) {
                        (plainPost.userId as any).id = (plainPost.userId as any)._id.toString();
                    }
                    return plainPost;
                });
            });
    }

    async findOne(id: string): Promise<Post> {
        const post = await this.postModel
            .findById(id)
            .populate('userId', 'name email')
            .exec();

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        // Transform the populated userId to include id field
        const plainPost = post.toObject();
        if (plainPost.userId && (plainPost.userId as any)._id) {
            (plainPost.userId as any).id = (plainPost.userId as any)._id.toString();
        }

        return plainPost as Post;
    }

    async update(id: string, updatePostDto: UpdatePostDto, userId: string): Promise<Post> {
        const post = await this.postModel.findById(id);

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        if (post.userId.toString() !== userId) {
            throw new NotFoundException('Unauthorized');
        }

        const updatedPost = await this.postModel
            .findByIdAndUpdate(id, updatePostDto, { new: true })
            .populate('userId', 'name email')
            .exec();

        if (!updatedPost) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        return updatedPost;
    }

    async remove(id: string, userId: string): Promise<void> {
        const post = await this.postModel.findById(id);

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        if (post.userId.toString() !== userId) {
            throw new NotFoundException('Unauthorized');
        }

        await this.postModel.findByIdAndDelete(id);
    }
}
