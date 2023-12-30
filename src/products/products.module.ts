import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';
import { Bid } from 'src/bids/bid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, User, Bid])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
