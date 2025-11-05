import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/user.entity';
import { ApprovalController } from './approval.controller';
import { ApprovalService } from './approval.service';
import { PurchaseRequest } from '../pr/purchase-requests.entity';
import { Approval } from './approval.entity';
import { ApprovalConfig } from '../approvalconfig/approval-config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApprovalConfig,
      Users,
      PurchaseRequest,
      Approval,
    ]),
  ],
  controllers: [ApprovalController],
  providers: [ApprovalService],
})
export class ApprovalModule {}
