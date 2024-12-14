import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistsEntity } from './entities/wishlists.entity';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistsEntity)
    private readonly wishlistsRepository: Repository<WishlistsEntity>,
    private readonly wishesService: WishesService,
  ) {}

  async create(userId: number, dto: CreateWishlistDto) {
    const items = dto.itemsId.map((item) => ({
      id: item,
    }));
    const wishlist = this.wishlistsRepository.create({
      ...dto,
      owner: { id: userId },
      items,
    });
    return this.wishlistsRepository.save(wishlist);
  }

  async getOne(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true, items: { owner: true } },
      select: {
        owner: {
          id: true,
          username: true,
          avatar: true,
        },
        items: {
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
          owner: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
    if (!wishlist) throw new NotFoundException();
    return wishlist;
  }

  async getAll() {
    return this.wishlistsRepository.find({
      relations: { owner: true },
      select: { owner: { id: true, username: true, avatar: true } },
    });
  }

  async delete(id: number, userId: number) {
    const wishlist = await this.getOne(id);
    if (wishlist.owner.id !== userId) throw new ForbiddenException();
    await this.wishlistsRepository.delete({ id });
    return { id };
  }

  async update(userId: number, wishListId: number, dto: UpdateWishlistDto) {
    const wishList = await this.wishlistsRepository.findOne({
      where: {
        id: wishListId,
      },
      relations: {
        items: true,
        owner: true,
      },
      select: {
        owner: { id: true, username: true, avatar: true },
      },
    });

    if (!wishList) throw new NotFoundException();
    if (wishList.owner.id !== userId) throw new ForbiddenException();

    const { itemsId, ...data } = dto;

    const items = await this.wishesService.getByIds(itemsId);

    return this.wishlistsRepository.save({ ...wishList, ...data, items });
  }
}
