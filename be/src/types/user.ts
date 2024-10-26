import { LessonEnum, SubstituteDayEnum } from '@prisma/client';

export interface BaseUser {
  username: string;
  public_id: string;
  role: string;
  lessons?: LessonEnum[];
  substitutes?: SubstituteDayEnum[];
}

export interface FullUser extends BaseUser {
  password: string;
}
