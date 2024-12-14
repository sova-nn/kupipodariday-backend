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
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('wishlistlists')
export class WishlistController {
  constructor(private readonly wishlistsService: WishlistService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@User('id') id: number, @Body() dto: CreateWishlistDto) {
    return this.wishlistsService.create(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWishlistDto,
  ) {
    await this.wishlistsService.update(userId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.wishlistsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishlistsService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @User('id') userId: number) {
    return this.wishlistsService.delete(id, userId);
  }
}
