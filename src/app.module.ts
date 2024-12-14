import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { WishModule } from './wishes/wish.module';
import { WishlistModule } from './wishlists/wishlist.module';
import { OfferModule } from './offers/offer.module';
import { AuthModule } from './authentification/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1',
      database: 'nest_project',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    WishModule,
    WishlistModule,
    OfferModule,
    AuthModule,
  ],
})
export class AppModule {}