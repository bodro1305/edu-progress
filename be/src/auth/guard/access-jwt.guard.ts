import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';

@Injectable()
export class AccessJwtGuard extends AuthGuard('access_jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | any {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    return super.canActivate(context);
  }

  private parseJwtError(error: string): string {
    return (
      error?.split(': ')[1]?.toUpperCase().replace(/\s+/g, '_') ||
      'UNKNOWN_ERROR'
    );
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    const errorType = this.parseJwtError(info?.toString());

    if (errorType === 'JWT_EXPIRED') {
      throw new UnauthorizedException('access Token expired');
    } else if (info) {
      throw new UnauthorizedException(errorType);
    }

    return user;
  }
}
