import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { WishlistsEntity } from './entities/wishlists.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistsEntity]), WishesModule],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
