import { OfferEntity } from 'src/offers/offer.entity';
import { WishEntity } from 'src/wishes/wish.entity';
import { WishlistEntity } from 'src/wishlists/wishlist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => WishEntity, (wishes) => wishes.owner)
  wishes: WishEntity[];

  @OneToMany(() => OfferEntity, (offers) => offers.user)
  offers: OfferEntity[];

  @OneToMany(() => WishlistEntity, (wishlists) => wishlists.owner)
  wishlists: WishlistEntity[];
}
