import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserDeletionException } from './exceptions/user-deletion.exception';
import { Product } from 'src/products/product.entity';
import { Bid } from 'src/bids/bid.entity';
import { Order } from 'src/orders/order.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProductsService } from 'src/products/products.service';
import { ProductSalesStatus } from 'src/products/enums/product-sales-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Bid)
    private readonly bidsRepository: Repository<Bid>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly dataSource: DataSource,
    private readonly productsService: ProductsService,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    const user = this.usersRepository.findOneBy({ id: id });
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  async update({
    id,
    updateUserDto,
  }: {
    id: number;
    updateUserDto: UpdateUserDto;
  }): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new UserNotFoundException(id);
    }
    const updatedUser = Object.assign(user, updateUserDto);
    return this.usersRepository.save(updatedUser);
  }

  async remove(id: number): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new UserNotFoundException(id);
    }
    // 해당 사용자가 등록한 경매 진행 중인 상품이 있는지 확인
    const products = await this.productsRepository.find({
      where: { user_id: id },
    });
    const productsNotSold = products.filter(
      (product) => product.p_sales_status == ProductSalesStatus.Available,
    );
    if (productsNotSold.length > 0) {
      throw new UserDeletionException(id, '경매');
    }
    await this.productsRepository.remove(products);

    // 경매가 진행 중이고 최고가 입찰자인 상품이 있는지 확인
    const bids = await this.bidsRepository.find({
      where: { user_id: id },
    });
    const productIds = bids.map((bid) => bid.products_id);
    const productWithBids = await this.productsRepository.find({
      where: { id: In(productIds) },
    });
    const productWithBidsAndNotSold = productWithBids.filter(
      (product) => product.p_sales_status !== 'Sold',
    );
    if (productWithBidsAndNotSold.length > 0) {
      throw new UserDeletionException(id, '입찰');
    }
    await this.bidsRepository.remove(bids);

    // 유저가 주문상태가 End가 아닌 주문이 있는지 확인
    const orders = await this.ordersRepository.find({
      where: { user_id: id },
    });
    const ordersNotEnd = orders.filter((order) => order.o_status !== 'End');
    if (ordersNotEnd.length > 0) {
      throw new UserDeletionException(id, '주문');
    }
    await this.ordersRepository.remove(orders);

    await this.usersRepository.remove(user);
    // await this.dataSource.transaction(async (manager) => {
    //   await this.productsService.deleteUserProducts(id, manager);
    //   await manager.delete(User, { id });
    // });
    return true;
  }
}
