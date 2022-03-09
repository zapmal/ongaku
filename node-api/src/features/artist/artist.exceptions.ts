import { NotFoundException } from '@nestjs/common';

export class ArtistNotFound extends NotFoundException {
  constructor() {
    super('El artista no existe');
  }
}
