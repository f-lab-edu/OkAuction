import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserDeletionException } from './exceptions/user-deletion.exception';
import { Product } from 'src/products/product.entity';
import { Bid } from 'src/bids/bid.entity';
import { Order } from 'src/orders/order.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { IncorrectPasswordException } from 'src/auth/exceptions/incorrect-password.exception';

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
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { u_id, u_password } = createUserDto;
    // u_id가 중복되는지 확인
    const existingUser = await this.usersRepository.findOneBy({
      u_id: u_id,
    });
    if (existingUser) {
      throw new UserAlreadyExistsException(u_id);
    }
    // 패스워드를 암호화
    const salt = await bcrypt.genSaltSync();
    const hashedPassword = await bcrypt.hashSync(u_password, salt);
    createUserDto.u_password = hashedPassword;

    const user = this.usersRepository.create(createUserDto);
    const savedUser = await this.usersRepository.save(user);

    const userResponse: UserResponseDto = {
      id: savedUser.id,
      u_id: savedUser.u_id,
      u_name: savedUser.u_name,
      u_email: savedUser.u_email,
      u_phone: savedUser.u_phone,
      u_address: savedUser.u_address,
      u_addr_postcode: savedUser.u_addr_postcode,
      u_address_sub: savedUser.u_address_sub,
    };
    return userResponse;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) {
      throw new UserNotFoundException(id);
    }
    const userResponse: UserResponseDto = {
      id: user.id,
      u_id: user.u_id,
      u_name: user.u_name,
      u_email: user.u_email,
      u_phone: user.u_phone,
      u_address: user.u_address,
      u_addr_postcode: user.u_addr_postcode,
      u_address_sub: user.u_address_sub,
    };
    return userResponse;
  }

  async fetchOne(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) {
      throw new UserNotFoundException(id);
    }
    const userResponse: UserResponseDto = {
      id: user.id,
      u_id: user.u_id,
      u_name: user.u_name,
      u_email: user.u_email,
      u_phone: user.u_phone,
      u_address: user.u_address,
      u_addr_postcode: user.u_addr_postcode,
      u_address_sub: user.u_address_sub,
    };
    return userResponse;
  }

  async update({
    id,
    updateUserDto,
  }: {
    id: number;
    updateUserDto: UpdateUserDto;
  }): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new UserNotFoundException(id);
    }
    const updatedUser = Object.assign(user, updateUserDto);
    const savedUser = await this.usersRepository.save(updatedUser);
    const userResponse: UserResponseDto = {
      id: savedUser.id,
      u_id: savedUser.u_id,
      u_name: savedUser.u_name,
      u_email: savedUser.u_email,
      u_phone: savedUser.u_phone,
      u_address: savedUser.u_address,
      u_addr_postcode: savedUser.u_addr_postcode,
      u_address_sub: savedUser.u_address_sub,
    };
    return userResponse;
  }

  async remove(id: number): Promise<string> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new UserNotFoundException(id);
    }
    // 해당 사용자가 등록한 상품이 있는지 확인
    const products = await this.productsRepository.find({
      where: { user_id: id },
    });
    if (products.length > 0) {
      throw new UserDeletionException(id, '상품');
    }

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

    // 유저가 주문상태가 End가 아닌 주문이 있는지 확인
    const orders = await this.ordersRepository.find({
      where: { user_id: id },
    });
    const ordersNotEnd = orders.filter((order) => order.o_status !== 'End');
    if (ordersNotEnd.length > 0) {
      throw new UserDeletionException(id, '주문');
    }

    await this.usersRepository.remove(user);
    return 'success';
  }

  async updatePassword({
    id,
    updatePasswordDto,
  }: {
    id: number;
    updatePasswordDto: UpdatePasswordDto;
  }): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new UserNotFoundException(id);
    }

    const isMatch = await bcrypt.compare(
      updatePasswordDto.currentPassword,
      user.u_password,
    );
    if (!isMatch) {
      throw new IncorrectPasswordException();
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(
      updatePasswordDto.newPassword,
      salt,
    );
    user.u_password = hashedPassword;
    await this.usersRepository.save(user);
    return true;
  }

  async findOneByUId(u_id: string): Promise<User> {
    return await this.usersRepository.findOneBy({ u_id });
  }
}
