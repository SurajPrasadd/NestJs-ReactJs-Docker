import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Refund } from './refund.entity';
import { ConfigService } from '@nestjs/config';
import { Order } from '../order/order.entity';
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  REFUNDED_STATUS,
} from '../common/constants/app.constants';

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private config: ConfigService,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Refund) private refundRepo: Repository<Refund>,
  ) {
    const keyId = this.config.get<string>('RAZORPAY_KEY_ID', '');
    const keySecret = this.config.get<string>('RAZORPAY_KEY_SECRET', '');
    this.razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }

  /** Create Razorpay Order */
  async createOrder(body: any) {
    const { orderId } = body;

    const order = await this.orderRepo.findOneBy({ id: orderId });
    if (!order) throw new BadRequestException('Order not found');

    const amountPaise = Math.round(Number(order.totalAmount) * 100);
    const razorOrder = await this.razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: order.orderNumber,
    });

    const payment = this.paymentRepo.create({
      order,
      amount: Number(order.totalAmount),
      razorpayOrderId: razorOrder.id,
      status: PAYMENT_STATUS.CREATED,
    });

    await this.paymentRepo.save(payment);

    return {
      key: this.config.get<string>('RAZORPAY_KEY_ID'),
      amount: Number(order.totalAmount),
      currency: 'INR',
      name: 'B2B',
      razorpayOrderId: razorOrder.id,
    };
  }

  /** Verify payment signature after frontend checkout */
  async verify(body: any) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const payment = await this.paymentRepo.findOne({
      where: { razorpayOrderId: razorpay_order_id },
      relations: ['order'],
    });

    if (!payment) throw new BadRequestException('Payment record not found');

    const expected = crypto
      .createHmac('sha256', this.config.get<string>('RAZORPAY_KEY_SECRET', ''))
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expected !== razorpay_signature) {
      payment.status = PAYMENT_STATUS.FAILED;
      ('');
      await this.paymentRepo.save(payment);
      throw new BadRequestException('Invalid signature');
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = PAYMENT_STATUS.PAID;
    await this.paymentRepo.save(payment);

    // update order status
    payment.order.status = ORDER_STATUS.COMPLETED;
    await this.orderRepo.save(payment.order);

    return { message: 'Payment verified and order completed' };
  }

  generateSignature() {
    const body = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_test123',
            amount: 55000,
            order_id: 'order_test_001',
          },
        },
      },
    });

    const signature = crypto
      .createHmac('sha256', this.config.get<string>('RAZORPAY_KEY_SECRET', ''))
      .update(body)
      .digest('hex');

    return {
      rawBody: body,
      signature,
    };
  }

  // Webhook handler: rawBody is Buffer
  async handleWebhook(rawBody: Buffer, signature: string) {
    const expected = crypto
      .createHmac('sha256', this.config.get<string>('RAZORPAY_KEY_SECRET', ''))
      .update(rawBody)
      .digest('hex');

    if (expected !== signature) {
      this.logger.warn('Invalid webhook signature');
      throw new BadRequestException('Invalid webhook signature');
    }

    const payload = JSON.parse(rawBody.toString());
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;

    if (!paymentEntity) {
      this.logger.warn('Webhook received without payment entity');
      return { status: 'ignored' };
    }

    const razorpayOrderId = paymentEntity.order_id;
    const razorpayPaymentId = paymentEntity.id;

    const payment = await this.paymentRepo.findOne({
      where: { razorpayOrderId },
      relations: ['order'],
    });

    if (!payment) {
      this.logger.warn(
        `Payment not found for razorpayOrderId=${razorpayOrderId}`,
      );
      return { status: 'ignored' };
    }

    if (event === 'payment.captured' || event === 'payment.authorized') {
      payment.razorpayPaymentId = razorpayPaymentId;
      payment.status = PAYMENT_STATUS.PAID;
      await this.paymentRepo.save(payment);

      payment.order.status = ORDER_STATUS.COMPLETED;
      await this.orderRepo.save(payment.order);
    } else if (event === 'payment.failed') {
      payment.status = PAYMENT_STATUS.FAILED;
      await this.paymentRepo.save(payment);
      payment.order.status = ORDER_STATUS.PENDING;
      await this.orderRepo.save(payment.order);
    } else if (event === 'refund.processed' || event.startsWith('refund.')) {
      // webhook refund events may be handled on Refund module if desired
      // keep simple here
      this.logger.log(`Refund event: ${event}`);
    }

    return { status: 'ok' };
  }

  // Create refund via Razorpay and persist Refund entity
  async createRefund(body: any) {
    const { paymentId, razorpayPaymentId, amount } = body;

    // Resolve Payment entity
    let payment: Payment | null = null;
    if (paymentId) {
      payment = await this.paymentRepo.findOne({
        where: { id: paymentId },
        relations: ['order'],
      });
    } else if (razorpayPaymentId) {
      payment = await this.paymentRepo.findOne({
        where: { razorpayPaymentId },
        relations: ['order'],
      });
    }

    if (!payment) throw new BadRequestException('Payment not found');

    // Amount in paise for Razorpay
    const refundAmountPaise = amount
      ? { amount: Math.round(amount * 100) }
      : {};

    // create local Refund record (CREATED)
    const refund = this.refundRepo.create({
      order: payment.order,
      amount: amount ?? Number(payment.amount),
      status: REFUNDED_STATUS.CREATED,
    });
    await this.refundRepo.save(refund);

    try {
      // Razorpay refund API (correct format)
      const razorpayResponse = await this.razorpay.payments.refund(
        payment.razorpayPaymentId,
        refundAmountPaise,
      );

      // Persist Razorpay details
      refund.razorpayRefundId = razorpayResponse.id;
      refund.status =
        razorpayResponse.status === 'processed'
          ? REFUNDED_STATUS.SUCCESS
          : REFUNDED_STATUS.PROCESSING;
      await this.refundRepo.save(refund);

      // If full refund, update payment + order
      if ((amount ?? Number(payment.amount)) >= Number(payment.amount)) {
        payment.status = PAYMENT_STATUS.REFUNDED;
        await this.paymentRepo.save(payment);

        payment.order.status = ORDER_STATUS.CANCELLED;
        await this.orderRepo.save(payment.order);
      }

      return { refund, razorpayResponse };
    } catch (err: any) {
      refund.status = PAYMENT_STATUS.FAILED;
      await this.refundRepo.save(refund);
      throw new BadRequestException(err?.error?.description || 'Refund failed');
    }
  }

  // fetch refund status by local refund id or razorpay refund id
  async getRefund(body: any) {
    const { refundId, razorpayRefundId } = body;

    let refund: Refund | null = null;
    if (refundId) {
      refund = await this.refundRepo.findOne({
        where: { id: refundId },
        relations: ['order'],
      });
    } else if (razorpayRefundId) {
      refund = await this.refundRepo.findOne({
        where: { razorpayRefundId },
        relations: ['order'],
      });
    }
    if (!refund) throw new BadRequestException('Refund not found');

    // fetch latest from Razorpay if razorpayRefundId exists
    if (refund.razorpayRefundId) {
      const r = await this.razorpay.refunds.fetch(refund.razorpayRefundId);

      if (r.status === 'processed') {
        refund.status = REFUNDED_STATUS.SUCCESS;
      } else {
        refund.status = r.status;
      }
      await this.refundRepo.save(refund);
    }
    return refund;
  }
}
