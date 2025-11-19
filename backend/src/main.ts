import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  // Razorpay webhook needs raw body (for signature verification)
  app.use('/payment/webhook', bodyParser.raw({ type: 'application/json' }));

  await app.listen(5000);
  console.log('🚀 Backend running on http://localhost:5000');
}
bootstrap();
