import { NotFoundException } from '@nestjs/common';

export class UserNotFound extends NotFoundException {
  constructor() {
    super('The requested user was not found');
  }
}
