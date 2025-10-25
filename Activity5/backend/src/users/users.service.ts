import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const { email, name, password } = createUserDto;

        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new this.userModel({
            email,
            name,
            password: hashedPassword,
        });

        const savedUser = await user.save();
        return new UserResponseDto({
            id: savedUser._id?.toString() || savedUser.id,
            email: savedUser.email,
            name: savedUser.name,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt,
        });
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email });
    }

    async findById(id: string): Promise<UserResponseDto | null> {
        const user = await this.userModel.findById(id);
        if (!user) {
            return null;
        }

        return new UserResponseDto({
            id: user._id?.toString() || user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }

    async validateUser(email: string, password: string): Promise<UserDocument | null> {
        const user = await this.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }
}
