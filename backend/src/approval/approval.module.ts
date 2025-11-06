import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalController } from './approval.controller';
import { ApprovalService } from './approval.service';
import { PurchaseRequest } from '../pr/purchase-requests.entity';
import { Approval } from './approval.entity';
import { PurchaseRequestItem } from '../pr/purchase-request-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseRequest, Approval, PurchaseRequestItem]),
  ],
  controllers: [ApprovalController],
  providers: [ApprovalService],
})
export class ApprovalModule {}
