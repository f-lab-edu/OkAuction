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
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { ConfirmOrderDto } from './dto/confirm-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createProductDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createProductDto);
  }

  @Post(':id')
  confirmOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) confirmOrderDto: ConfirmOrderDto,
  ): Promise<Order> {
    return this.ordersService.confirmOrder({ id, confirmOrderDto });
  }

  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update({ id, updateOrderDto });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ordersService.remove(id);
  }
}
