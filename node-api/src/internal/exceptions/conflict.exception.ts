import { HttpException, HttpStatus } from '@nestjs/common';

export class Conflict extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
