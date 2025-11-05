import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseRequest } from './purchase-requests.entity';
import { Approval } from '../approval/approval.entity';
import { BusinessProduct } from '../products/businessproduct.entity';
import { PRController } from './pr.controller';
import { PRService } from './pr.service';
import { ApprovalConfig } from 'src/approvalconfig/approval-config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseRequest,
      Approval,
      ApprovalConfig,
      BusinessProduct,
    ]),
  ],
  controllers: [PRController],
  providers: [PRService],
})
export class PRModule {}
