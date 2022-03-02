import { NotFoundException } from '@nestjs/common';

export class UserNotFound extends NotFoundException {
  constructor() {
    super('El usuario no ha sido encontrado');
  }
}
