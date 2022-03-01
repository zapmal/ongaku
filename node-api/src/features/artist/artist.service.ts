import {
  NotFoundException as NotFound,
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

  async follow(artistId: number, entityId: number) {
    try {
      const foundArtist = await this.prisma.artist.findUnique({
        where: {
          id: artistId,
        },
        include: {
          interaction: {
            where: {
              artistId: artistId,
              userId: entityId,
            },
            select: {
              id: true,
              value: true,
            },
          },
        },
      });

      if (!foundArtist?.id) {
        throw new NotFound('El artista que intentas seguir no existe');
      }

      const isFollowed = Boolean(foundArtist.interaction[0]?.value);
      const update = isFollowed ? { decrement: 1 } : { increment: 1 };

      const followResult = await this.prisma.interaction.upsert({
        where: { id: foundArtist.interaction[0]?.id || 0 },
        update: {
          value: !isFollowed,
        },
        create: {
          value: !isFollowed,
          userId: entityId,
          artistId: artistId,
        },
      });

      await this.prisma.artistMetrics.upsert({
        where: {
          artistId: artistId,
        },
        update: {
          followers: {
            ...update,
          },
        },
        create: {
          artistId: artistId,
        },
      });

      return followResult.value;
    } catch (error) {
      throw new InternalServerError(
        'Ocurrió un erorr inesperado mientras registrabamos tu seguimiento al artista, intentalo más tarde',
      );
    }
  }

  async getFollowed(entityId: number) {
    const followedArtists = await this.prisma.interaction.findMany({
      where: {
        userId: entityId,
        value: true,
        userPlaylistId: null,
        albumId: null,
        songId: null,
      },
      select: {
        id: false,
        artist: {
          select: {
            id: true,
            avatar: true,
            artisticName: true,
            band: {
              select: {
                name: true,
              },
            },
            artistMetrics: {
              select: {
                followers: true,
              },
            },
          },
        },
      },
    });

    return followedArtists;
  }

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
