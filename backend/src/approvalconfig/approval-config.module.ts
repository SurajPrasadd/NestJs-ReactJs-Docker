import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalConfig } from './approval-config.entity';
import { Users } from '../users/user.entity';
import { ApprovalConfigService } from './approval-config.service';
import { ApprovalConfigController } from './approval-config.controller';
import { PurchaseRequest } from '../pr/purchase-requests.entity';
import { Approval } from 'src/approval/approval.entity';
import { ApprovalConfigBusiness } from './approval-config-business.entity';
import { ApprovalBSConfigService } from './approvalbs-config.service';
import { ApprovalBSConfigController } from './approvalbs-config.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApprovalConfigBusiness,
      ApprovalConfig,
      Users,
      PurchaseRequest,
      Approval,
    ]),
  ],
  controllers: [ApprovalConfigController, ApprovalBSConfigController],
  providers: [ApprovalConfigService, ApprovalBSConfigService],
})
export class ApprovalConfigModule {}
