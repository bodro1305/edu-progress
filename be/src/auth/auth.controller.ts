import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Public } from './decorator/public.decorator';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request) {
    const data = await this.authService.login(req.user);
    return {
      payload: data,
    };
  }
}
