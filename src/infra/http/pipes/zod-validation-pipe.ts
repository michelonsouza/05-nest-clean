import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationPipe<DataType = any> implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: DataType, _metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: fromZodError(error),
          statusCode: 400,
        });
      }

      throw new BadRequestException('Validation failed');
    }

    return value;
  }
}
