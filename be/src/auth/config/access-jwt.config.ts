import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'access-jwt-config',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_ACCESS_SECRET_TOKEN,
    signOptions: {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    },
  }),
);
