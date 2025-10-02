import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

export interface AuthResponse {
    access_token: string;
    user: UserResponseDto;
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
        const user = await this.usersService.create(createUserDto);
        const payload = { sub: user.id, email: user.email };

        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async login(loginUserDto: LoginUserDto): Promise<AuthResponse> {
        const user = await this.usersService.validateUser(
            loginUserDto.email,
            loginUserDto.password,
        );

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const userResponse = new UserResponseDto({
            id: user._id?.toString() || user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });

        const payload = { sub: userResponse.id, email: userResponse.email };

        return {
            access_token: this.jwtService.sign(payload),
            user: userResponse,
        };
    }
}