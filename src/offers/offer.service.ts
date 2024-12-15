import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferEntity } from './offer.entity';
import { Repository } from 'typeorm';
import { WishService } from 'src/wishes/wish.service';
import { CreateOfferDto } from "./create-offer.dto";

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(OfferEntity)
    private readonly offersRepository: Repository<OfferEntity>,
    private readonly wishesService: WishService,
  ) {}

  async create(userId: number, dto: CreateOfferDto) {
    await this.wishesService.addRaised(dto.itemId, dto.amount, userId);

    const offer = this.offersRepository.create({
      ...dto,
      item: { id: dto.itemId },
      user: { id: userId },
    });
    return await this.offersRepository.save(offer);
  }

  async getOne(id: number) {
    const offers = await this.offersRepository.findOne({
      where: { id },
      relations: { user: true, item: { owner: true } },
      select: {
        user: { id: true, username: true, avatar: true },
        item: {
          id: true,
          copied: true,
          description: true,
          price: true,
          image: true,
          link: true,
          name: true,
          raised: true,
          createdAt: true,
          updatedAt: true,
          owner: { id: true, username: true, avatar: true },
        },
      },
    });
    if (!offers) throw new NotFoundException();
    return offers;
  }

  async getAll() {
    return this.offersRepository.find({
      relations: { user: true, item: { owner: true } },
      where: {
        hidden: false,
      },
      select: {
        user: { id: true, username: true, avatar: true },
        item: {
          id: true,
          copied: true,
          description: true,
          price: true,
          image: true,
          link: true,
          name: true,
          raised: true,
          createdAt: true,
          updatedAt: true,
          owner: { id: true, username: true, avatar: true },
        },
      },
    });
  }
}
