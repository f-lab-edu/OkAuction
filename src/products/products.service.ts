import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductNotFoundException } from './exceptions/product-not-found.exception';
import { ProductAlreadySoldException } from './exceptions/product-already-sold.exception';
import { InvalidProductStateException } from './exceptions/invalid-product-state.exception';
import { Category } from 'src/categories/category.entity';
import { CategoryNotFoundException } from 'src/categories/exceptions/category-not-found.exception';
import { InvalidCategoryException } from './exceptions/invalid-cagetgory.exception';
import { User } from 'src/users/user.entity';
import { UserNotFoundException } from 'src/users/exceptions/user-not-found.exception';
import { Bid } from 'src/bids/bid.entity';
import { ProductDeletionException } from './exceptions/product-deletion.exception';
import { InvalidProductTimeException } from './exceptions/invalid-product-time.exception';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
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

    //start_time이 현재 시간보다 빠른지 확인
    const currentTime = new Date();
    console.log(createProductDto.start_time instanceof Date);
    if (createProductDto.start_time < currentTime) {
      throw new InvalidProductTimeException();
    }

    //end_time은 start_time에서 p_dur_date(경매 진행일)을 더한 값
    const { start_time, p_dur_date } = createProductDto;
    const end_time = new Date(start_time);
    end_time.setSeconds(end_time.getSeconds() + p_dur_date);
    createProductDto.end_time = end_time;

    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findOne(id: number): Promise<Product> {
    return this.productsRepository.findOneBy({ id: id });
  }

  async remove(id: number): Promise<string> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new ProductNotFoundException(id);
    }
    if (product.p_sales_status === 'Sold') {
      throw new ProductAlreadySoldException(id);
    }
    // 해당 Product에 연결된 Bids가 있는지 확인
    const relatedBids = await this.bidRepository.find({
      where: { products_id: id },
    });
    if (relatedBids.length > 0) {
      throw new ProductDeletionException(id);
    }

    await this.productsRepository.delete(id);

    return 'success';
  }

  //업테이트는 본인만 할 수 있도록 나중에 수정
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

  async updateProductStatus(
    id: number,
    status: 'Available' | 'Pending' | 'Sold',
  ): Promise<void> {
    await this.productsRepository.save({ id, p_sales_status: status });
  }

  async findByCategory(
    c_id: number,
    c_id2?: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<Product[]> {
    const skip = (page - 1) * limit; // 건너뛸 아이템의 수를 계산

    if (c_id2) {
      // c_id2가 주어진 경우, 해당 서브 카테고리에 속하는 제품들을 조회
      return this.productsRepository.find({
        where: { c_id2 },
        take: limit,
        skip: skip,
      });
    } else {
      // c_id2가 주어지지 않은 경우, 주 카테고리(c_id)에 속하는 제품들을 조회
      return this.productsRepository.find({
        where: { c_id },
        take: limit,
        skip: skip,
      });
    }
  }
}

interface IProductsServiceUpdate {
  id: number;
  updateProductDto: UpdateProductDto;
}
