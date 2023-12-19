import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { ProductsModule } from './products/products.module';
import { Category } from './category/category.entity';
import { CategoriesModule } from './category/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'ok-auction',
      entities: [User, Product, Category],
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    ProductsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
