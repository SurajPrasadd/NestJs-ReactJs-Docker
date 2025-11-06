import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './business.entity';
import { Contact } from './contacts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Business, Contact])],
  controllers: [],
  providers: [],
})
export class BusinessModule {}
