import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseRequest } from './purchase-requests.entity';
import { Approval } from '../approval/approval.entity';
import { PRController } from './pr.controller';
import { PRService } from './pr.service';
import { ApprovalConfig } from '../approvalconfig/approval-config.entity';
import { PurchaseRequestItem } from './purchase-request-item.entity';
import { CartItem } from '../cart/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartItem,
      ApprovalConfig,
      Approval,
      PurchaseRequest,
      PurchaseRequestItem,
    ]),
  ],
  controllers: [PRController],
  providers: [PRService],
})
export class PRModule {}
