// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from './modules/auth/auth.module';
// import { UserModule } from './modules/user/user.module';
// import { SessionModule } from './modules/session/session.module';
// import { Role } from './modules/user/role.entity';
// import { User } from './modules/user/user.entity';
// import { Session } from './modules/session/session.entity';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DATABASE_HOST || 'localhost',
//       port: Number(process.env.DATABASE_PORT) || 5432,
//       username: process.env.DATABASE_USER || 'postgres',
//       password: process.env.DATABASE_PASSWORD || 'postgres',
//       database: process.env.DATABASE_NAME || 'appdb',
//       entities: [Users, Role, Session],
//       synchronize: true, // disable in prod; for dev convenience
//       autoLoadEntities: true,
//       logging: true,
//     }),
//     AuthModule,
//     UsersModule,
//     SessionModule,
//   ],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { Users } from './users/user.entity';
import { Session } from './auth/session.entity';
import { AuthController } from './auth/auth.controller';
import { AuthRepository } from './auth/auth.repository';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

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
      entities: [Users, Session],
      synchronize: true,
      autoLoadEntities: true,
      logging: true, // optional: shows SQL logs in console
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
