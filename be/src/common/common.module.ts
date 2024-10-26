import { Global, Module } from '@nestjs/common';
import { PrismaService } from './service/prisma.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { HttpExceptionFilter } from './filter/http-exception.filter';

@Global()
@Module({
  exports: [PrismaService],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    PrismaService,
  ],
})
export class CommonModule {}
