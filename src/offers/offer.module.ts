import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferEntity } from './offer.entity';
import { WishModule } from 'src/wishes/wish.module';

@Module({
  imports: [TypeOrmModule.forFeature([OfferEntity]), WishModule],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {}
