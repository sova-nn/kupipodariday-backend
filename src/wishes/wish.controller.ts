import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { UpdateWishDto } from './dto/update-wish.dto';

@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('wishes')
export class WishController {
  constructor(private readonly wishesService: WishService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@User('id') id: number, @Body() dto: CreateWishDto) {
    return this.wishesService.create(id, dto);
  }

  @Get('top')
  getTop() {
    return this.wishesService.getTop();
  }

  @Get('last')
  getLast() {
    return this.wishesService.getLast();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishesService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @User('id') userId: number) {
    return this.wishesService.delete(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWishDto,
  ) {
    return this.wishesService.update(id, dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copy(@Param('id', ParseIntPipe) id: number, @User('id') userId: number) {
    return this.wishesService.copy(id, userId);
  }
}
