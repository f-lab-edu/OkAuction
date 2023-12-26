import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductNotFoundException } from './exceptions/product-not-found.exception';
import { ProductAlreadySoldException } from './exceptions/product-already-sold.exception';
import { InvalidProductStateException } from './exceptions/invalid-product-state.exception';
import { Category } from 'src/category/category.entity';
import { CategoryNotFoundException } from 'src/category/exceptions/category-not-found.exception';
import { InvalidCategoryException } from './exceptions/invalid-cagetgory.exception';
import { User } from 'src/users/user.entity';
import { UserNotFoundException } from 'src/users/exceptions/user-not-found.exception';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { c_id, c_id2, user_id } = createProductDto;

    // 사용자 존재 여부 확인
    const user = await this.userRepository.findOne({
      where: { id: user_id },
    });
    if (!user) {
      throw new UserNotFoundException(user_id);
    }

    //c_id가 존재하는지 확인
    const category = await this.categoryRepository.findOne({
      where: { c_id, c_id2: null },
    });
    if (!category) {
      throw new CategoryNotFoundException(c_id);
    }

    //c_id2가 null이 아닌 경우, 맞는 1차 카테고리에 속하는지 확인
    if (c_id2) {
      const category2 = await this.categoryRepository.findOne({
        where: { c_id: c_id2, c_id2: Not(IsNull()) },
      });
      if (!category2 || category2.c_id2 !== c_id) {
        throw new InvalidCategoryException(c_id2);
      }
    }

    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findOne(id: number): Promise<Product> {
    return this.productsRepository.findOneBy({ id: id });
  }

  async remove(id: number): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new ProductNotFoundException(id);
    }
  }

  //업테이트는 본인만 할 수 있도록
  async update({
    id,
    updateProductDto,
  }: IProductsServiceUpdate): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new ProductNotFoundException(id);
    }
    if (product.p_sales_status === 'Sold') {
      throw new ProductAlreadySoldException(id);
    }
    if (product.p_sales_status === 'Pending') {
      throw new InvalidProductStateException(id, product.p_sales_status);
    }

    const { c_id, c_id2 } = updateProductDto;
    //c_id가 존재하는지 확인
    if (c_id) {
      const category = await this.categoryRepository.findOne({
        where: { c_id },
      });
      if (!category) {
        throw new CategoryNotFoundException(c_id);
      }
    }
    //c_id2가 null이 아닌 경우, 맞는 1차 카테고리에 속하는지 확인
    if (c_id2) {
      const category2 = await this.categoryRepository.findOne({
        where: { c_id: c_id2 },
      });
      if (!category2 || category2.c_id2 !== c_id) {
        throw new InvalidCategoryException(c_id2);
      }
    }

    const updatedProduct = Object.assign(product, updateProductDto);
    return this.productsRepository.save(updatedProduct);
  }
}

interface IProductsServiceUpdate {
  id: number;
  updateProductDto: UpdateProductDto;
}
