import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalConfig } from './approval-config.entity';
import { Users } from '../users/user.entity';
import { ApprovalConfigService } from './approval-config.service';
import { ApprovalConfigController } from './approval-config.controller';
import { ApprovalConfigBusiness } from './approval-config-business.entity';
import { ApprovalBSConfigService } from './approvalbs-config.service';
import { ApprovalBSConfigController } from './approvalbs-config.controller';
import { Business } from '../business/business.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApprovalConfig,
      Users,
      Business,
      ApprovalConfigBusiness,
    ]),
  ],
  controllers: [ApprovalConfigController, ApprovalBSConfigController],
  providers: [ApprovalConfigService, ApprovalBSConfigService],
})
export class ApprovalConfigModule {}
