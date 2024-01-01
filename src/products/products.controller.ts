import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { scheduleJob } from 'node-schedule';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { UsersService } from 'src/users/users.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    const product = await this.productsService.create(createProductDto);
    const jobId = `product-${product.id}`;
    scheduleJob(jobId, new Date(product.end_time), async () => {
      await this.productsService.updateProductStatus(product.id);
      console.log(`제품 ID${product.id} 경매 종료`);
      const user = await this.usersService.findOne(product.user_id);
      const createdOrder = new CreateOrderDto();
      createdOrder.user_id = user.id;
      createdOrder.o_address = user.u_address;
      createdOrder.o_address_sub = user.u_address_sub;
      createdOrder.o_addr_postcode = user.u_addr_postcode;
      createdOrder.o_status = 'Temp';
      createdOrder.product_id = product.id;
      createdOrder.o_price = product.highest_bid;
      await this.ordersService.create(createdOrder);
    });
    return product;
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update({ id, updateProductDto });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
