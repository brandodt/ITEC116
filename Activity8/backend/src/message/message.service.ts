import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatroomService } from '../chatroom/chatroom.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private chatroomService: ChatroomService,
  ) {}

  async create(chatroomId: string, dto: CreateMessageDto): Promise<Message> {
    // Verify chatroom exists
    await this.chatroomService.findOne(chatroomId);

    const created = new this.messageModel({
      chatroomId,
      ...dto,
    });
    const saved = await created.save();

    // Increment message count
    await this.chatroomService.incrementMessageCount(chatroomId);

    return saved;
  }

  async findAllByChatroom(chatroomId: string): Promise<Message[]> {
    // Verify chatroom exists
    await this.chatroomService.findOne(chatroomId);

    return this.messageModel
      .find({ chatroomId })
      .sort({ createdAt: 1 })
      .exec();
  }

  async remove(chatroomId: string, messageId: string): Promise<{ deleted: boolean }> {
    const result = await this.messageModel
      .findOneAndDelete({ _id: messageId, chatroomId })
      .exec();
    if (!result) throw new NotFoundException('Message not found');
    return { deleted: true };
  }

  async removeAllByChatroom(chatroomId: string): Promise<void> {
    await this.messageModel.deleteMany({ chatroomId }).exec();
  }
}
