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
    const salt = await genSalt(8);
    const hashPassword = await hash(dto.password, salt);

    const data = {
      ...dto,
      password: hashPassword,
    }
    const { id, username, about, avatar, email, createdAt, updatedAt } =
      await this.usersService.create(data)

    return { id, username, about, avatar, email, createdAt, updatedAt };
  }

  async validate(user: string) {
    return await this.usersService.findOneByUsername(user);
  }
}