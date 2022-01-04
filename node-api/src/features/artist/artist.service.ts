import {
  Injectable,
  InternalServerErrorException as InternalServerError,
} from '@nestjs/common';
import { Prisma, Artist } from '@prisma/client';

import { PrismaService } from '@/internal/services';
import { PrismaError } from '@/internal/constants';

import { ArtistNotFound } from './artist.exceptions';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  getByEmail(email: string): Promise<Artist> {
    const artist = this.prisma.artist.findFirst({
      where: { email },
    });

    if (!artist) throw new ArtistNotFound();

    return artist;
  }

  getByArtisticName(artisticName: string): Promise<Artist> {
    const artist = this.prisma.artist.findFirst({
      where: { artisticName },
    });

    if (!artist) throw new ArtistNotFound();

    return artist;
  }

  async update(id: number, newArtistData: Prisma.ArtistUpdateInput): Promise<Artist> {
    try {
      return await this.prisma.artist.update({
        where: { id },
        data: newArtistData,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new ArtistNotFound();
      }
      throw new InternalServerError('Something went wrong, try again later');
    }
  }
}
