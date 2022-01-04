import { NotFoundException } from '@nestjs/common';

export class ArtistNotFound extends NotFoundException {
  constructor() {
    super('The requested artist was not found');
  }
}
