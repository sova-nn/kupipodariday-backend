import { Module } from '@nestjs/common';
import { WishService } from './wish.service';
import { WishController } from './wish.controller';
import { WishesEntity } from './wish.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([WishesEntity])],
  controllers: [WishController],
  providers: [WishService],
  exports: [WishService],
})
export class WishModule {}
