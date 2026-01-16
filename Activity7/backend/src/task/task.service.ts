import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(dto: CreateTaskDto): Promise<Task> {
    const created = new this.taskModel({
      ...dto,
      status: dto.status || 'todo',
    });
    return created.save();
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Task not found');
    return { deleted: true };
  }
}
