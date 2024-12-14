import { OffersEntity } from 'src/offers/offer.entity';
import { UserEntity } from 'src/users/user.entity';
import { WishlistEntity } from 'src/wishlists/wishlist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('wishes')
export class WishEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column({ type: 'float4' })
  price: number;

  @Column({ type: 'float4' })
  raised: number;

  @Column()
  description: string;

  @Column({ default: 0 })
  copied: number;

  @ManyToOne(() => UserEntity, (user) => user.wishes)
  owner: UserEntity;

  @OneToMany(() => OffersEntity, (offers) => offers.item, { cascade: true })
  offers: OffersEntity[];

  @ManyToOne(() => WishlistEntity, (wishlists) => wishlists.items, {
    onDelete: 'SET NULL',
  })
  wishlist: WishlistEntity;
}
