import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { MESSAGES, RESPONSE_CODE } from '../common/constants/app.constants';
import { GetCartDto } from './dto/get-cart.dto';

@Controller('cart')
@UseGuards(RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('addToCart')
  async addToCart(@Req() req, @Body() dto: AddToCartDto) {
    try {
      const user = req.user; // from JWT guard
      const cartItem = await this.cartService.addToCart(user, dto);
      return ResponseUtil.success(MESSAGES.SUCCESS, null);
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Post('getUserCart')
  async getUserCart(@Req() req, @Body() dto: GetCartDto) {
    try {
      const user = req.user;
      const { page, limit } = dto;
      const cart = await this.cartService.getUserCart(user.id, page, limit);
      return ResponseUtil.success(MESSAGES.SUCCESS, cart);
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }

  @Delete('deleteFromCart/:id')
  async removeItem(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.cartService.removeFromCart(id);
      return ResponseUtil.success(MESSAGES.SUCCESS, null);
    } catch (error: unknown) {
      return ResponseUtil.handleError(error, RESPONSE_CODE.INTERNAL_ERROR);
    }
  }
}
