import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/user.entity';
import { UserService } from '../users/user.service';
import { SignUpDto } from './dto/signup.dto';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
  ) {}

  async auth(user: UserEntity) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: SignUpDto) {
    const userEmail = await this.usersService.findOneByEmail(dto.email);
    const userName = await this.usersService.findOneByUsername(
      dto.username,
    );
    if (userEmail) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    if (userName) {
      throw new BadRequestException(
        'Пользователь с таким именем уже существует',
      );
    }

    const salt = await genSalt(8);
    const hashPassword = await hash(dto.password, salt);
    const { id, username, about, avatar, email, createdAt, updatedAt } =
      await this.usersService.create({
        ...dto,
        password: hashPassword,
      });
    return { id, username, about, avatar, email, createdAt, updatedAt };
  }

  async validate(user: string) {
    return await this.usersService.findOneByUsername(user);
  }
}