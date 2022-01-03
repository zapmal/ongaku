import { HttpException, HttpStatus } from '@nestjs/common';

export class FailedDependency extends HttpException {
  constructor() {
    super('Failed Dependency', HttpStatus.FAILED_DEPENDENCY);
  }
}
