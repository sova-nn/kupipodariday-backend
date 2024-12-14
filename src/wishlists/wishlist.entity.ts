import { UserEntity } from 'src/users/user.entity';
import { WishEntity } from "src/wishes/wish.entity";

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('wishlists')
export class WishlistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'varchar' })
  description: string | null;

  @Column()
  image: string;

  @OneToMany(() => WishEntity, (wishes) => wishes.wishlist, { cascade: true })
  items: WishEntity[];

  @ManyToOne(() => UserEntity, (users) => users.wishlists)
  owner: UserEntity;
}
