import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ProductsService } from './products.service';
import { OrdersService } from 'src/orders/orders.service';
import { UsersService } from 'src/users/users.service';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
// 필요한 다른 의존성들을 임포트

@Processor('productQueue')
export class ProductProcessor {
  constructor(
    private readonly productService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
  ) {}

  @Process('endAuction')
  async handleAuctionEnd(job: Job) {
    const { productId, userId, highest_bid } = job.data;
    console.log(`제품 ID ${productId} 경매 종료`);
    await this.productService.updateProductStatus(productId, 'Sold');
    const user = await this.usersService.findOne(userId);
    //CreateOrderDto를 사용하여 주문 생성
    const createdOrder = new CreateOrderDto();
    createdOrder.user_id = user.id;
    createdOrder.o_address = user.u_address;
    createdOrder.o_address_sub = user.u_address_sub;
    createdOrder.o_addr_postcode = user.u_addr_postcode;
    createdOrder.o_status = 'Temp';
    createdOrder.product_id = productId;
    createdOrder.o_price = highest_bid;
    await this.ordersService.create(createdOrder);
  }

  @Process('startAuction')
  async handleAuctionStart(job: Job) {
    const { productId } = job.data;
    console.log(`제품 ID ${productId} 경매 시작`);
    await this.productService.updateProductStatus(productId, 'Available');
  }
}
