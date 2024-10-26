import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategy/local.strategy';
import { AccessJwtStrategy } from './strategy/access-jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AccessJwtGuard } from './guard/access-jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import accessJwtConfig from './config/access-jwt.config';
import { ConfigModule } from '@nestjs/config';
import refreshJwtConfig from './config/refresh-jwt.config';
import { UserService } from '@/user/user.service';
import { UserModule } from '@/user/user.module';
import { RoleAuthGuard } from './guard/role-auth.guard';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync(accessJwtConfig.asProvider()),
    ConfigModule.forFeature(accessJwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    AccessJwtStrategy,
    { provide: APP_GUARD, useClass: AccessJwtGuard },
    { provide: APP_GUARD, useClass: RoleAuthGuard },
  ],
})
export class AuthModule {}
