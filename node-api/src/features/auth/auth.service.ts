import { Injectable } from '@nestjs/common';
import { Prisma, User, Artist } from '@prisma/client';

import { PrismaService } from '@/internal/services';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  createUser(
    user: Prisma.UserCreateInput,
    metadata: Prisma.UserMetadataCreateInput,
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...user,
        userMetadata: {
          create: {
            ...metadata,
          },
        },
      },
    });
  }

  createSoloArtist(artist: Prisma.ArtistCreateInput): Promise<Artist> {
    return this.prisma.artist.create({ data: artist });
  }

  createBand(artist: Prisma.ArtistCreateInput, band: Prisma.BandCreateInput) {
    return this.prisma.artist.create({
      data: {
        ...artist,
        band: {
          create: {
            ...band,
          },
        },
      },
    });
  }

  getUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: { email: email },
    });
  }
}
