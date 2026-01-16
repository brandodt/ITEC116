import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';
import { Chatroom, ChatroomSchema } from './chatroom.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chatroom.name, schema: ChatroomSchema }])],
  controllers: [ChatroomController],
  providers: [ChatroomService],
  exports: [ChatroomService],
})
export class ChatroomModule {}
