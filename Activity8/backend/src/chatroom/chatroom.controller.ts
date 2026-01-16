import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';

@ApiTags('chatrooms')
@Controller('chatrooms')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chatroom', description: 'Creates a new chatroom for users to join' })
  @ApiResponse({ status: 201, description: 'Chatroom created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() dto: CreateChatroomDto) {
    return this.chatroomService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all chatrooms', description: 'Retrieves a list of all chatrooms' })
  @ApiResponse({ status: 200, description: 'List of chatrooms retrieved successfully' })
  findAll() {
    return this.chatroomService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a chatroom by ID', description: 'Retrieves a single chatroom by its ID' })
  @ApiParam({ name: 'id', description: 'Chatroom ID (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'Chatroom found' })
  @ApiResponse({ status: 404, description: 'Chatroom not found' })
  findOne(@Param('id') id: string) {
    return this.chatroomService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a chatroom', description: 'Updates an existing chatroom by ID' })
  @ApiParam({ name: 'id', description: 'Chatroom ID (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'Chatroom updated successfully' })
  @ApiResponse({ status: 404, description: 'Chatroom not found' })
  update(@Param('id') id: string, @Body() dto: UpdateChatroomDto) {
    return this.chatroomService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chatroom', description: 'Permanently deletes a chatroom and all its messages' })
  @ApiParam({ name: 'id', description: 'Chatroom ID (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'Chatroom deleted successfully' })
  @ApiResponse({ status: 404, description: 'Chatroom not found' })
  remove(@Param('id') id: string) {
    return this.chatroomService.remove(id);
  }
}
