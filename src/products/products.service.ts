import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto): Promise<Product> {
    const user = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(user);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findOne(id: number): Promise<Product> {
    return this.productsRepository.findOneBy({ id: id });
  }

  async remove(id: string): Promise<void> {
    await this.productsRepository.delete(id);
  }

  async update({
    id,
    updateProductDto,
  }: IProductsServiceUpdate): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('해당 제품이 존재하지 않습니다.');
    }
    if (product.p_sales_status === 'Sold') {
      throw new UnprocessableEntityException('이미 판매된 제품입니다.');
    }
    if (product.p_sales_status === 'Pending') {
      throw new UnprocessableEntityException('이미 판매중인 제품입니다.');
    }
    const updatedProduct = Object.assign(product, updateProductDto);
    return this.productsRepository.save(updatedProduct);
  }
}

interface IProductsServiceUpdate {
  id: number;
  updateProductDto: UpdateProductDto;
}
