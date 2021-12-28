import { Injectable } from '@nestjs/common';
import { Prisma, Artist } from '@prisma/client';

import { PrismaService } from '@/internal/services';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  getByEmail(email: string): Promise<Artist> {
    return this.prisma.artist.findFirst({
      where: { email },
    });
  }

  getByArtisticName(artisticName: string): Promise<Artist> {
    return this.prisma.artist.findFirst({
      where: { artisticName },
    });
  }

  update(id: number, newArtistData: Prisma.ArtistUpdateInput): Promise<Artist> {
    return this.prisma.artist.update({
      where: { id },
      data: newArtistData,
    });
  }
}
