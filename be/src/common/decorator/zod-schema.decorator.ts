import { ValidateZodSchema } from '@/util';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ZodSchema as ZodSchemaType } from 'zod';

export const ZodSchema = (schema: ZodSchemaType<any>) => {
  return createParamDecorator(async (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const validatedBody = await ValidateZodSchema(schema, request.body);

    request.body = validatedBody;

    return validatedBody;
  })();
};
