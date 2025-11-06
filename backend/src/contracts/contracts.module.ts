import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './contract.entity';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { PurchaseRequest } from '../pr/purchase-requests.entity';
import { Users } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, PurchaseRequest, Users])],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
