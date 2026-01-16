import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chatroom, ChatroomDocument } from './chatroom.schema';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';

@Injectable()
export class ChatroomService {
  constructor(@InjectModel(Chatroom.name) private chatroomModel: Model<ChatroomDocument>) {}

  async create(dto: CreateChatroomDto): Promise<Chatroom> {
    const created = new this.chatroomModel(dto);
    return created.save();
  }

  async findAll(): Promise<Chatroom[]> {
    return this.chatroomModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Chatroom> {
    const chatroom = await this.chatroomModel.findById(id).exec();
    if (!chatroom) throw new NotFoundException('Chatroom not found');
    return chatroom;
  }

  async update(id: string, dto: UpdateChatroomDto): Promise<Chatroom> {
    const chatroom = await this.chatroomModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!chatroom) throw new NotFoundException('Chatroom not found');
    return chatroom;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.chatroomModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Chatroom not found');
    return { deleted: true };
  }

  async incrementMessageCount(id: string): Promise<void> {
    await this.chatroomModel.findByIdAndUpdate(id, { $inc: { messageCount: 1 } }).exec();
  }

  async updateParticipantCount(id: string, count: number): Promise<void> {
    await this.chatroomModel.findByIdAndUpdate(id, { participantCount: count }).exec();
  }
}
