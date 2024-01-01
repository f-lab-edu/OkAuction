import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductNotFoundException } from '../products/exceptions/product-not-found.exception';
import { User } from 'src/users/user.entity';
import { UserNotFoundException } from 'src/users/exceptions/user-not-found.exception';
import { OrderNotFoundException } from './exceptions/order-not-found.exception';
import { InvalidOrderStatusException } from './exceptions/invalid-order-status.exception';
import { Product } from 'src/products/product.entity';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { InsufficientFundsException } from './exceptions/insufficient-funds.exception';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // 경매가 마감되어 임시로 주문 생성.
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { user_id, product_id } = createOrderDto;

    // 더블체크: 사용자, 상품 존재 여부 확인
    const user = await this.userRepository.findOne({
      where: { id: user_id },
    });
    if (!user) {
      throw new UserNotFoundException(user_id);
    }
    const product = await this.productRepository.findOne({
      where: { id: product_id },
    });
    if (!product) {
      throw new ProductNotFoundException(product_id);
    }

    const order = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(order);
  }

  async confirmOrder({
    id,
    confirmOrderDto,
  }: {
    id: number;
    confirmOrderDto: ConfirmOrderDto;
  }): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id: id });
    if (!order) {
      throw new OrderNotFoundException(id);
    }

    if (order.o_status !== 'Temp') {
      throw new InvalidOrderStatusException(order.o_status);
    }

    //order의 유저를 찾아서 유저의 잔액을 확인.
    const user = await this.userRepository.findOneBy({ id: order.user_id });
    if (!user) {
      throw new UserNotFoundException(order.user_id);
    }
    if (user.u_point < order.o_price) {
      throw new InsufficientFundsException();
    }
    user.u_point -= order.o_price;
    await this.userRepository.save(user);

    const updatedOrder = Object.assign(order, confirmOrderDto);
    updatedOrder.o_status = 'Confirmed';
    return this.orderRepository.save(updatedOrder);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  findOne(id: number): Promise<Order> {
    const order = this.orderRepository.findOneBy({ id: id });
    if (!order) {
      throw new OrderNotFoundException(id);
    }
    return order;
  }

  async remove(id: number): Promise<void> {
    const order = await this.orderRepository.findOneBy({ id: id });
    if (!order) {
      throw new OrderNotFoundException(id);
    }
    await this.orderRepository.remove(order);
  }

  async update({
    id,
    updateOrderDto,
  }: {
    id: number;
    updateOrderDto: UpdateOrderDto;
  }): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id: id });
    if (!order) {
      throw new OrderNotFoundException(id);
    }

    //업데이트는 prepared, pending 상태에서만 가능
    if (order.o_shipping !== 'prepared' && order.o_shipping !== 'pending') {
      throw new InvalidOrderStatusException(order.o_shipping);
    }

    const updatedOrder = Object.assign(order, updateOrderDto);
    return this.orderRepository.save(updatedOrder);
  }
}
