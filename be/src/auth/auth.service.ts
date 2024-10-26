import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import * as argon2 from 'argon2';
import { BaseUser } from '@/types/user';
import { PrismaService } from '@/common/service/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid username');
    }

    if (!(await argon2.verify(user.password, password))) {
      throw new UnauthorizedException('Invalid password');
    }
    delete user.password;
    return user;
  }

  async validateJwtUser(public_id: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: {
        public_id,
      },
      select: {
        username: true,
        full_name: true,
        public_id: true,
        role: true,
        is_substitute: true,
        lessons: true,
        journals_filled: true,
        journals_substituted: true,
        substitute: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }

  async generateTokens(public_id: string) {
    const payload = { sub: public_id };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(user: any) {
    return await this.generateTokens(user.public_id);
  }
}
