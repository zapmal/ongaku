import { Injectable } from '@nestjs/common';
import { Artist } from '@prisma/client';

import { PrismaService } from '@/internal/services';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  getByEmail(email: string): Promise<Artist> {
    return this.prisma.artist.findFirst({
      where: { email: email },
    });
  }
}
