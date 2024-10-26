import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { JournalService } from './journal.service';
import { Role } from '@/auth/decorator/role.decorator';
import { ZodSchema } from '@/common/decorator/zod-schema.decorator';
import { CREATE_JOURNAL_SCHEMA } from '@/zod-schema/journal.zod-schema';

@Controller({
  version: '1',
  path: 'journal',
})
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Role('regular')
  @Post('/')
  async createJournal(
    @ZodSchema(CREATE_JOURNAL_SCHEMA)
    @Body()
    createJournalDto: CREATE_JOURNAL_SCHEMA,
  ) {
    const journal = await this.journalService.createJournal(createJournalDto);
    return {
      payload: journal,
    };
  }

  @Role('admin')
  @Get('/')
  async getJournals() {
    const journals = await this.journalService.getJournals();
    return {
      payload: { journals },
    };
  }

  @Role('regular')
  @Get('/byLessonPublicId')
  async getJournalsByLessonPublicIds(
    @Query('lessonPublicIds') lessonPublicIds: string[],
  ) {
    const journals =
      await this.journalService.getJournalsByLessonPublicIds(lessonPublicIds);

    return {
      payload: {
        journals,
      },
    };
  }

  @Get('/:public_id')
  async getJournalByPublicId(@Param('public_id') publicId: string) {
    const journal = await this.journalService.getJournalByPublicId(publicId);
    return {
      payload: journal,
    };
  }
}
