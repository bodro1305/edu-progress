import { z } from 'zod';

export const LOGIN_SCHEMA = z
  .object({
    username: z.string({
      required_error: 'username is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
    // .min(8, {
    //   message: 'Password must be at least 8 characters',
    // }),
  })
  .strict({
    message: 'invalid entity',
  });

export type LOGIN_SCHEMA = z.infer<typeof LOGIN_SCHEMA>;
