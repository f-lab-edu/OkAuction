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
  Query,
  DefaultValuePipe,
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

  @Get('/available')
  findAuctionAvailable(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Product[]> {
    limit = limit > 100 ? 100 : limit; // 최대 limit를 100으로 설정하여 너무 많은 데이터 요청을 방지
    return this.productsService.findAuctionAvailable(page, limit);
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

  @Get('category/:c_id')
  findByCategory(
    @Param('c_id', ParseIntPipe) c_id: number,
    @Query('c_id2') c_id2?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Product[]> {
    limit = limit > 100 ? 100 : limit; // 최대 limit를 100으로 설정하여 너무 많은 데이터 요청을 방지
    return this.productsService.findByCategory(c_id, c_id2, page, limit);
  }
}
