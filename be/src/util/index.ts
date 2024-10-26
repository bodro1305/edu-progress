import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export const ValidateZodSchema = async (schema: ZodSchema, data: any) => {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const hasUnrecognizedKeys = error.errors.some(
        (e) => e.code === 'unrecognized_keys',
      );

      if (hasUnrecognizedKeys) {
        throw new UnprocessableEntityException('UNPROCESSABLE_ENTITY');
      }
      const errors = error.errors.map((e) => {
        if (e.code === 'invalid_type') {
          return `${e.path[0].toString().toUpperCase()}_${e.message.split(' ').join('_').toUpperCase().split(',')[0]}`;
        }

        return e.message.split(' ').join('_').toUpperCase();
      });

      throw new BadRequestException(errors);
    }
    throw error;
  }
};
