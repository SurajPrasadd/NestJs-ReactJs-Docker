import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { ContractModule } from './contracts/contracts.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './products/product.module';
import { BusinessModule } from './business/business.module';
import { SequenceFixService } from './common/utils/fix-sequences.util';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
      logging: true, // optional: shows SQL logs in console
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // points to your uploads folder
      serveRoot: '/uploads', // accessible at http://localhost:5000/uploads/...
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    CartModule,
    ContractModule,
    OrderModule,
    ProductModule,
    BusinessModule,
  ],
  controllers: [AppController],
  providers: [AppService, SequenceFixService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seqFixService: SequenceFixService) {}

  async onApplicationBootstrap() {
    // Automatically fix sequences on startup
    await this.seqFixService.fixSequences();
  }
}
