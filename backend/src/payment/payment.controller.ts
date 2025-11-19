import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Public } from '../auth/guards/public.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create')
  async create(@Body() body: any) {
    const res = await this.paymentService.createOrder(body);
    return res;
  }

  @Post('verify')
  async verify(@Body() body: any) {
    const res = await this.paymentService.verify(body);
    return res;
  }

  // webhook endpoint (raw body) - signature from header 'x-razorpay-signature'
  @Public()
  @Post('webhook')
  async webhook(
    @Req() req: any,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    if (!req.body || !req.body.length) {
      throw new BadRequestException('Raw body required for webhook');
    }

    return this.paymentService.handleWebhook(req.body, signature);
  }

  @Post('refund')
  async createrefunds(@Body() body: any) {
    return this.paymentService.createRefund(body);
  }

  @Post('refundStatus')
  async getrefunds(@Body() body: any) {
    return this.paymentService.getRefund(body);
  }

  //Testing
  @Public()
  @Get('generate-signature')
  generateSignature() {
    return this.paymentService.generateSignature();
  }
}
