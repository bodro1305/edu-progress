import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs(
  'refresh-jwt-config',
  (): JwtSignOptions => ({
    secret: process.env.JWT_REFRESH_SECRET_TOKEN,
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  }),
);
