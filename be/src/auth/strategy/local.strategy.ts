import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LOGIN_SCHEMA } from '@/zod-schema/auth.zod-schema';
import { ValidateZodSchema } from '@/util';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string) {
    await ValidateZodSchema(LOGIN_SCHEMA, { username, password });
    return this.authService.validateUser(username, password);
  }
}
