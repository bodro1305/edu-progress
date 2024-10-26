import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

interface IHttpException {
  statusCode: number;
  message: string[] | string;
  error: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { message, error, statusCode } =
      exception.getResponse() as IHttpException;

    return response.status(statusCode).json({
      status: statusCode,
      message: Array.isArray(message)
        ? message.map((msg) => msg.toUpperCase().split(' ').join('_'))
        : [message.toUpperCase().split(' ').join('_')],
      error: error?.toUpperCase().split(' ').join('_'),
    });
  }
}
