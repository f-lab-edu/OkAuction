import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, User])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
