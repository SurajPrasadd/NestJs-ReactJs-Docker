// order.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ResponseUtil } from '../common/utils/response.util';
import {
  MESSAGES,
  RESPONSE_CODE,
  UPLOAD_PATH,
} from '../common/constants/app.constants';
import { GetOrdersDto } from './dto/get-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UploadFile } from '../common/upload-file.decorator';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('createOrder')
  async createOrder(@Req() req, @Body() dto: CreateOrderDto) {
    try {
      const user = req.user; // from JWT guard
      const result = await this.orderService.createOrderFromCart(user, dto);
      return ResponseUtil.success(MESSAGES.SUCCESS, result);
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Post('getAllOrders')
  async getAllOrders(@Body() query: GetOrdersDto) {
    try {
      return ResponseUtil.success(
        MESSAGES.SUCCESS,
        await this.orderService.getAllOrders(query),
      );
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Post('updateOrder')
  @UploadFile('pdf', 'invoice')
  async updateOrder(
    @Body('dto') dtoString: string, // JSON string
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const imagePath = file ? UPLOAD_PATH.INVOICE + file.filename : null;
      const dto: UpdateOrderDto = JSON.parse(dtoString);
      return ResponseUtil.success(
        MESSAGES.SUCCESS,
        await this.orderService.updateOrder(dto, imagePath),
      );
    } catch (error) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }
}
