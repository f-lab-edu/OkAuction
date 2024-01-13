import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Product } from 'src/products/product.entity';
import { Bid } from 'src/bids/bid.entity';
import { Order } from 'src/orders/order.entity';
import { ProductsService } from 'src/products/products.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Bid, Order])],
  providers: [UsersService, ProductsService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
