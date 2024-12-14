import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/authentification/decorators/user.decorator';
import { SignUpDto } from 'src/authentification/dto/signup.dto'
import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class FindUserDto {
  @IsString()
  query: string;
}

export class UpdateUserDto extends PartialType(SignUpDto) {}

@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('me')
  profile(@User('id') id: number) {
    return this.usersService.profile(id);
  }

  @Patch('me')
  updateProfile(@Body() dto: UpdateUserDto, @User('id') id: number) {
    return this.usersService.updateProfile(id, dto);
  }

  @Get('me/wishes')
  getOwnWishes(@User('id') userId: number) {
    return this.usersService.getWishesById(userId);
  }

  @Get(':username/wishes')
  getAnotherUserWishes(@Param('username') username: string) {
    return this.usersService.getWishesByNickname(username);
  }

  @Get(':username')
  getAnotherUser(@Param('username') username: string) {
    return this.usersService.getAnotherUser(username);
  }

  @Post('find')
  findMany(@Body() { query }: FindUserDto) {
    return this.usersService.findUser(query);
  }
}
