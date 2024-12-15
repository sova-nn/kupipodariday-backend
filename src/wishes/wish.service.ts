import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WishEntity } from './wish.entity';
import { In, Repository } from 'typeorm';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(WishEntity)
    private readonly wishesRepository: Repository<WishEntity>,
  ) {}

  async getAllByUserId(userId: number) {
    return this.wishesRepository.find({
      where: { owner: { id: userId }, offers: { user: true } },
      select: {
        offers: { user: { id: true, username: true, avatar: true } },
        owner: { id: true, username: true, avatar: true },
      },
    });
  }

  async create(userId: number, dto: CreateWishDto) {
    const wishes = this.wishesRepository.create({
      ...dto,
      price: +dto.price.toFixed(2),
      copied: 0,
      raised: 0,
      owner: { id: userId },
    });
    return await this.wishesRepository.save(wishes);
  }

  async getOne(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true, offers: { user: true } },
      select: {
        owner: { id: true, username: true, avatar: true },
        offers: {
          id: true,
          amount: true,
          hidden: true,
          createdAt: true,
          updatedAt: true,
          user: { id: true, username: true, avatar: true },
        },
      },
    });
    if (!wish) throw new NotFoundException();
    return wish;
  }

  async delete(id: number, userId: number) {
    const wish = await this.getOne(id);
    if (wish.owner.id !== userId) throw new ForbiddenException();
    await this.wishesRepository.delete({ id });
    return { id };
  }

  async update(id: number, dto: UpdateWishDto, userId: number) {
    const wish = await this.getOne(id);
    if (wish.owner.id !== userId) throw new ForbiddenException();
    if (wish.offers.length && dto.price) {
      throw new BadRequestException(
        'Вы не можете менять цену, после того как на него уже скинулись',
      );
    }
    if (dto.price) dto.price = +dto.price.toFixed(2);
    return await this.wishesRepository.save({ ...wish, ...dto });
  }

  async getTop() {
    return this.wishesRepository.find({
      take: 20,
      order: { copied: 'DESC' },
      relations: { owner: true },
      select: {
        owner: { id: true, username: true, avatar: true },
      },
    });
  }

  async getLast() {
    return this.wishesRepository.find({
      take: 40,
      order: {
        createdAt: 'DESC',
      },
      relations: { owner: true },
      select: {
        owner: { id: true, username: true, avatar: true },
      },
    });
  }

  async copy(id: number, userId: number) {
    const wishFromBase = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

    if (!wishFromBase) {
      throw new BadRequestException('Подарок не найден');
    }

    const wish = await this.getOne(id);
    wish.copied++;

    await this.wishesRepository.save(wish);
    return await this.create(userId, {
      description: wish.description,
      image: wish.image,
      link: wish.image,
      name: wish.name,
      price: wish.price,
    });
  }

  async addRaised(id: number, amount: number, userId: number) {
    const wish = await this.getOne(id);
    if (wish.owner.id === userId) {
      throw new BadRequestException('Вы не можете скинуться себе на подарок');
    }
    if (wish.price === wish.raised) {
      throw new BadRequestException(
        'Нельзя скинуться на уже собранный подарок',
      );
    }

    if (wish.price < wish.raised + amount) {
      throw new BadRequestException(
        'Вы не можете отправить такую сумму, так как сумма собранных средств не может превышать стоимость подарка ',
      );
    }
    wish.raised += amount;
    return this.wishesRepository.save(wish);
  }

  async getByIds(ids: number[]) {
    return this.wishesRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
