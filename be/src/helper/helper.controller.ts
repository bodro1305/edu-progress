import { Controller, Get } from '@nestjs/common';
import { HelperService } from './helper.service';
import { Public } from '@/auth/decorator/public.decorator';

@Controller({
  version: '1',
  path: 'helper',
})
export class HelperController {
  constructor(private readonly helperService: HelperService) {}

  @Public()
  @Get('/all-count')
  async getCounters() {
    const data = await this.helperService.getCounters();
    return {
      payload: data,
    };
  }
}
