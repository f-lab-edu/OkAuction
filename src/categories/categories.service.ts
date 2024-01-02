import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './category.entity';
import { CategoryAlreadyExistsException } from './exceptions/category-alread-exists.exception';
import { Product } from 'src/products/product.entity';
import { CategoryDeletionException } from './exceptions/category-deletion.exception';
import { CategoryNotFoundException } from './exceptions/category-not-found.exception';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const exisingCategory = await this.categoriesRepository.findOneBy({
      c_name: createCategoryDto.c_name,
    });
    if (exisingCategory) {
      throw new CategoryAlreadyExistsException(exisingCategory.c_name);
    }

    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  findOne(c_id: number): Promise<Category> {
    const category = this.categoriesRepository.findOneBy({ c_id: c_id });
    if (!category) {
      throw new CategoryNotFoundException(c_id);
    }
    return category;
  }

  async remove(id: number): Promise<string> {
    // 1차 카테고리로 참조하는 제품이 있는지 확인
    const relatedProductsPrimary = await this.productsRepository.find({
      where: { c_id: id },
    });
    // 1차 카테고리로 참조하는 제품이 있으면 삭제 불가
    if (relatedProductsPrimary.length > 0) {
      throw new CategoryDeletionException(id);
    } else {
      // 2차 카테고리로 참조하는 제품이 있는지 확인
      const relatedProductsSecondary = await this.productsRepository.find({
        where: { c_id2: id },
      });
      if (relatedProductsSecondary.length > 0) {
        throw new CategoryDeletionException(id);
      }
    }

    await this.categoriesRepository.delete(id);
    return 'success';
  }

  async update({
    id,
    updateCategoryDto,
  }: {
    id: number;
    updateCategoryDto: UpdateCategoryDto;
  }): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({
      c_id: id,
    });
    if (!category) {
      throw new CategoryNotFoundException(id);
    }
    const updatedCategory = Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(updatedCategory);
  }
}
