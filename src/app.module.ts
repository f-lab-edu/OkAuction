import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { ProductsModule } from './products/products.module';
import { Category } from './categories/category.entity';
import { CategoriesModule } from './categories/categories.module';
import { Bid } from './bids/bid.entity';
import { BidsModule } from './bids/bids.module';
import { Order } from './orders/order.entity';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'ok-auction',
      entities: [User, Product, Category, Bid, Order],
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    ProductsModule,
    CategoriesModule,
    BidsModule,
    OrdersModule,
  ],
})
export class AppModule {}
