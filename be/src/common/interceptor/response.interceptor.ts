import { IResponse, IResponseError } from '@/types';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, IResponse<T> | IResponseError>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T> | IResponseError> {
    const response = context.switchToHttp().getResponse() as Response;

    return next.handle().pipe(
      map((data) => {
        const status = data?.status;

        response.status(status || 200);

        return {
          status: status || 200,
          message: data.message,
          data: data.payload,
        };
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}
