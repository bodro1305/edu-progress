import { z } from 'zod';
import { ClassEnum, TeachingTimeEnum } from '@prisma/client';

export const CREATE_JOURNAL_SCHEMA = z
  .object({
    class_subject: z.nativeEnum(ClassEnum),
    lesson_public_id: z.string(),
    teaching_time: z.array(z.nativeEnum(TeachingTimeEnum)).nonempty(),
    summary: z.string(),
    is_substitute: z.boolean(),
    filled_by_public_id: z.string(),
    substitute_user_public_id: z.string().optional(),
  })
  .strict({
    message: 'Invalid entity',
  })
  .refine(
    (data) => {
      if (data.is_substitute) {
        return (
          data.substitute_user_public_id !== undefined &&
          data.substitute_user_public_id !== null
        );
      }

      return true;
    },
    {
      message:
        'Please enter a substitute public id if the journal is substitute.',
      path: ['substitute_user_public_id'],
    },
  )
  .refine(
    (data) => {
      if (!data.is_substitute) {
        return !data.substitute_user_public_id;
      }

      return true;
    },
    {
      message:
        'Please make sure the is substitute field is true if the journal is substitited.',
      path: ['substitute_user_public_id'],
    },
  );

export type CREATE_JOURNAL_SCHEMA = z.infer<typeof CREATE_JOURNAL_SCHEMA>;
