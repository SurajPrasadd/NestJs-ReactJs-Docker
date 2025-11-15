import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalConfig } from './approval-config.entity';
import { Users } from '../users/user.entity';
import { ApprovalConfigService } from './approval-config.service';
import { ApprovalConfigController } from './approval-config.controller';
import { Business } from '../business/business.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApprovalConfig, Users, Business])],
  controllers: [ApprovalConfigController],
  providers: [ApprovalConfigService],
})
export class ApprovalConfigModule {}
