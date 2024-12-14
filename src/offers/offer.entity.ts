import { UserEntity } from 'src/users/user.entity';
import { WishEntity } from 'src/wishes/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('offers')
export class OfferEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'float4' })
  amount: number;

  @Column({ default: false })
  hidden: boolean;

  @ManyToOne(() => UserEntity, (user) => user.offers)
  user: UserEntity;

  @ManyToOne(() => WishEntity, (wishes) => wishes.offers, {
    onDelete: 'CASCADE',
  })
  item: WishEntity;
}
