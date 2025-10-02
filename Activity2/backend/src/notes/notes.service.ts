import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
    constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) { }

    async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
        const note = new this.noteModel({
            ...createNoteDto,
            userId,
        });
        return note.save();
    }

    async findAll(userId: string): Promise<Note[]> {
        return this.noteModel.find({ userId }).sort({ updatedAt: -1 });
    }

    async findOne(id: string, userId: string): Promise<Note> {
        const note = await this.noteModel.findById(id);
        if (!note) {
            throw new NotFoundException('Note not found');
        }
        if (note.userId !== userId) {
            throw new ForbiddenException('Access denied');
        }
        return note;
    }

    async update(id: string, updateNoteDto: UpdateNoteDto, userId: string): Promise<Note> {
        await this.findOne(id, userId); // This checks ownership

        const updatedNote = await this.noteModel.findByIdAndUpdate(
            id,
            { ...updateNoteDto, updatedAt: new Date() },
            { new: true }
        );

        return updatedNote!;
    }

    async remove(id: string, userId: string): Promise<void> {
        const note = await this.findOne(id, userId); // This checks ownership
        await this.noteModel.findByIdAndDelete(id);
    }
}