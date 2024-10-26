import { PrismaService } from '@/common/service/prisma.service';
import { CREATE_JOURNAL_SCHEMA } from '@/zod-schema/journal.zod-schema';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class JournalService {
  constructor(private readonly prisma: PrismaService) {}

  async createJournal(data: CREATE_JOURNAL_SCHEMA) {
    const dataPost: Prisma.JournalCreateInput = {
      class_subject: data.class_subject,
      teaching_time: data.teaching_time,
      summary: data.summary,
      is_subsitute: data.is_substitute,
      filled_by_user: {
        connect: {
          public_id: data.filled_by_public_id,
        },
      },
      lesson: {
        connect: {
          lesson_public_id: data.lesson_public_id,
        },
      },
    };

    if (data.is_substitute) {
      dataPost.substitute_user = {
        connect: {
          public_id: data.substitute_user_public_id,
        },
      };
    }
    const journal = await this.prisma.journal.create({
      data: dataPost,
    });

    return journal;
  }

  async getJournals() {
    const journals = await this.prisma.journal.findMany({
      include: {
        filled_by_user: {
          select: {
            username: true,
            full_name: true,
            public_id: true,
          },
        },
        lesson: {
          select: {
            name: true,
            lesson_public_id: true,
          },
        },
      },
    });
    return journals;
  }

  async getJournalsByLessonPublicIds(lesson_public_id: string[]) {
    if (lesson_public_id == undefined || lesson_public_id == null)
      throw new BadRequestException('lesson_public_id required');

    if (!Array.isArray(lesson_public_id)) lesson_public_id = [lesson_public_id];
    const journals = await this.prisma.journal.findMany({
      where: {
        lesson_public_id: {
          in: lesson_public_id,
        },
      },
      include: {
        filled_by_user: {
          select: {
            username: true,
            full_name: true,
            public_id: true,
          },
        },
        lesson: {
          select: {
            name: true,
            lesson_public_id: true,
          },
        },
      },
    });
    return journals;
  }

  async getJournalByPublicId(publicId: string) {
    const journal = await this.prisma.journal.findUnique({
      where: { public_id: publicId },
      include: {
        filled_by_user: {
          select: {
            username: true,
            full_name: true,
            public_id: true,
          },
        },
        lesson: {
          select: {
            name: true,
            lesson_public_id: true,
          },
        },
      },
    });

    if (!journal) {
      throw new NotFoundException('Journal not found');
    }

    return journal;
  }
}
