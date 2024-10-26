import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.disable('x-powered-by');

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
  });

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
