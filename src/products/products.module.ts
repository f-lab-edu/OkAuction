import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';
import { Bid } from 'src/bids/bid.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { UsersModule } from 'src/users/users.module';
import { ProductQueueService } from './product-queue.service';
import { ProductProcessor } from './product.processor';
import { BullModule } from '@nestjs/bull';
import {
  ElasticsearchModule,
  // ElasticsearchService,
} from '@nestjs/elasticsearch';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, User, Bid]),
    OrdersModule,
    UsersModule,
    BullModule.registerQueue({
      name: 'productQueue',
    }),
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: 'http://localhost:9200',
      }),
    }),
  ],
  providers: [
    ProductsService,
    ProductQueueService,
    ProductProcessor,
    // ElasticsearchService,
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
