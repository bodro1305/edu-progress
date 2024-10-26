import { LessonEnum, SubstituteDayEnum } from '@prisma/client';
import { z } from 'zod';

export const CREATE_USER_SCHEMA = z
  .object({
    full_name: z.string(),
    username: z.string(),
    password: z.string(),
    lessons: z.array(z.nativeEnum(LessonEnum)),
    is_substitute: z.boolean(),
    substitute: z.nativeEnum(SubstituteDayEnum).optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.is_substitute) {
        return data.substitute !== undefined && data.substitute !== null;
      }

      return true;
    },
    {
      message:
        'Please select a substitute day if you are acting as a substitute teacher.',
      path: ['substitutes'],
    },
  )
  .refine(
    (data) => {
      if (!data.is_substitute) {
        return !data.substitute;
      }
      return true;
    },
    {
      message:
        'Substitute day should not be specified if you are not a substitute teacher.',
      path: ['substitute'],
    },
  );

export type CREATE_USER_SCHEMA = z.infer<typeof CREATE_USER_SCHEMA>;

export const UPDATE_USER_SCHEMA = z
  .object({
    full_name: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    lessons: z.array(z.nativeEnum(LessonEnum)).optional(),
    is_substitute: z.boolean().optional(),
    substitute: z.nativeEnum(SubstituteDayEnum).optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.is_substitute) {
        return data.substitute !== undefined && data.substitute !== null;
      }

      return true;
    },
    {
      message:
        'Please select a substitute day if you are acting as a substitute teacher.',
      path: ['substitutes'],
    },
  )
  .refine(
    (data) => {
      if (!data.is_substitute) {
        return !data.substitute;
      }
      return true;
    },
    {
      message:
        'Substitute day should not be specified if you are not a substitute teacher.',
      path: ['substitute'],
    },
  );

export type UPDATE_USER_SCHEMA = z.infer<typeof UPDATE_USER_SCHEMA>;

export const DELETE_USERS_SCHEMA = z.object({
  public_ids: z.array(z.string()).nonempty(),
});

export type DELETE_USERS_SCHEMA = z.infer<typeof DELETE_USERS_SCHEMA>;
