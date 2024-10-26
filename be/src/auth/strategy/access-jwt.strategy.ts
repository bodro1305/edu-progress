import { UserService } from '@/user/user.service';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import accessJwtConfig from '../config/access-jwt.config';
import { AuthService } from '../auth.service';

export class AccessJwtStrategy extends PassportStrategy(
  Strategy,
  'access_jwt',
) {
  constructor(
    @Inject(accessJwtConfig.KEY)
    jwtConfiguration: ConfigType<typeof accessJwtConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret,
    });
  }

  async validate(payload: JwtPayload) {
    return this.authService.validateJwtUser(payload.sub);
  }
}
