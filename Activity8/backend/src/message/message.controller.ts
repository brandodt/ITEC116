import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('messages')
@Controller('chatrooms/:chatroomId/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message', description: 'Sends a new message to a chatroom' })
  @ApiParam({ name: 'chatroomId', description: 'Chatroom ID (MongoDB ObjectId)' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Chatroom not found' })
  create(@Param('chatroomId') chatroomId: string, @Body() dto: CreateMessageDto) {
    return this.messageService.create(chatroomId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all messages', description: 'Retrieves all messages from a chatroom' })
  @ApiParam({ name: 'chatroomId', description: 'Chatroom ID (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'List of messages retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Chatroom not found' })
  findAll(@Param('chatroomId') chatroomId: string) {
    return this.messageService.findAllByChatroom(chatroomId);
  }

  @Delete(':messageId')
  @ApiOperation({ summary: 'Delete a message', description: 'Permanently deletes a message from a chatroom' })
  @ApiParam({ name: 'chatroomId', description: 'Chatroom ID (MongoDB ObjectId)' })
  @ApiParam({ name: 'messageId', description: 'Message ID (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'Message deleted successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  remove(@Param('chatroomId') chatroomId: string, @Param('messageId') messageId: string) {
    return this.messageService.remove(chatroomId, messageId);
  }
}
