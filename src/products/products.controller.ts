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
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueueService } from './product-queue.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productQueueService: ProductQueueService,
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    const product = await this.productsService.create(createProductDto);
    const startTime = new Date(product.start_time);
    const endTime = new Date(product.end_time);
    await this.productQueueService.addAuctionStartJob(product.id, startTime);
    await this.productQueueService.addAuctionEndJob(
      product.id,
      endTime,
      product.user_id,
      product.highest_bid,
    );
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
  ): Promise<Product> {
    return this.productsService.update({ id, updateProductDto });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.productsService.remove(id);
  }
}
