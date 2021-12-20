import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException as BadRequest,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);

    if (error) {
      const errors = error.details.map(({ message }) => message).join(', ');

      throw new BadRequest(errors);
    }

    return value;
  }
}
