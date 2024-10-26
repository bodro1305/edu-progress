import { PrismaService } from '@/common/service/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  constructor(private prisma: PrismaService) {}

  async getCounters() {
    const [journalCount, userCount] = await Promise.all([
      await this.prisma.journal.count({}),
      await this.prisma.user.count({
        where: {
          role: 'regular',
        },
      }),
    ]);
    return {
      journal: journalCount,
      user: userCount,
    };
  }
}
