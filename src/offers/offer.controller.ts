import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { User } from 'src/authentification/decorators/user.decorator';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateOffersDto {
  @IsInt()
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden: false;

  @IsInt()
  itemId: number;
}

@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('offers')
export class OfferController {
  constructor(private readonly offersService: OfferService) {}

  @Post()
  create(@Body() dto: CreateOffersDto, @User('id') id: number) {
    return this.offersService.create(id, dto);
  }

  @Get()
  getAll() {
    return this.offersService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.offersService.getOne(id);
  }
}
