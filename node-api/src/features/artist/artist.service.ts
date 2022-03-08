import {
  NotFoundException as NotFound,
  Injectable,
  InternalServerErrorException as InternalServerError,
  BadRequestException as BadRequest,
} from '@nestjs/common';
import { Prisma, Artist } from '@prisma/client';

import { PrismaService } from '@/internal/services';
import { PrismaError } from '@/internal/constants';

import { ArtistNotFound } from './artist.exceptions';
import { DEFAULT_ARTIST_IMAGES } from './artist.constants';
import { storeImages } from '@/internal/helpers';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const artists = await this.prisma.artist.findMany({
      include: {
        band: true,
        artistInformation: true,
      },
    });

    if (!artists) throw new NotFound('No se encontraron artistas registrados');

    return artists;
  }

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

  async getByName(name: string) {
    const artist = await this.prisma.artist.findFirst({
      where: {
        OR: [
          {
            artisticName: name,
          },
          {
            band: {
              name: name,
            },
          },
        ],
      },
      select: {
        yearsActive: true,
        artisticName: true,
        country: true,
        labels: true,
        genres: true,
        id: true,
        email: true,
        band: true,
        artistMetrics: {
          select: {
            followers: true,
          },
        },
        artistInformation: {
          select: {
            biography: true,
            coverImage: true,
            officialWebsite: true,
          },
        },
      },
    });

    if (!artist) throw new ArtistNotFound();

    return artist;
  }

  async getImagesById(id: number) {
    if (!id) throw new BadRequest('La solicitud está errada, falta información');

    const artist = await this.prisma.artist.findUnique({
      where: { id },
      select: {
        avatar: true,
        artistInformation: {
          select: {
            coverImage: true,
          },
        },
      },
    });

    if (!artist) throw new ArtistNotFound();

    return artist;
  }

  async getByGenre(artistId: number, genre: string) {
    return await this.prisma.artist.findMany({
      where: {
        genres: {
          hasSome: genre,
        },
        NOT: {
          OR: [{ id: artistId }, { bandId: artistId }],
        },
      },
      include: {
        band: true,
      },
      take: 4,
    });
  }

  async getPopularSongs(id: number) {
    return await this.prisma.song.findMany({
      where: {
        artistId: id,
        songMetrics: {
          playCount: {
            gt: 50,
          },
        },
      },
      include: {
        artist: {
          include: {
            band: true,
          },
        },
      },
      take: 5,
    });
  }

  async getAlbums(id: number) {
    return await this.prisma.album.findMany({
      where: {
        artistId: id,
      },
      include: {
        artist: {
          include: {
            band: true,
          },
        },
      },
    });
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
      console.log(error);
      throw new InternalServerError(
        'Ocurrió un error de nuestro lado, intentalo de nuevo luego',
      );
    }
  }

  async updateInformation(
    id: number,
    newArtistData: any,
    uploadedImages?: Array<Express.Multer.File>,
    path?: string,
  ): Promise<any> {
    let avatar = {};
    let newArtistDataWithCover = { ...newArtistData };

    try {
      if (uploadedImages['avatar']) {
        const [image] = storeImages(uploadedImages['avatar'][0], path);
        avatar = {
          avatar: image || DEFAULT_ARTIST_IMAGES.avatar,
        };
      }

      if (uploadedImages['cover']) {
        const [image] = storeImages(uploadedImages['cover'][0], path);
        newArtistDataWithCover = {
          ...newArtistData,
          coverImage: image || DEFAULT_ARTIST_IMAGES.cover,
        };
      }

      return await this.prisma.artist.update({
        where: { id },
        data: {
          ...avatar,
          artistInformation: {
            upsert: {
              create: {
                ...newArtistDataWithCover,
              },
              update: {
                ...newArtistDataWithCover,
              },
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new ArtistNotFound();
      }
      console.log(error);
      throw new InternalServerError(
        'Ocurrió un error de nuestro lado, intentalo de nuevo luego',
      );
    }
  }

  async delete(id: number): Promise<Artist> {
    const artistExists = await this.getImagesById(id);

    if (!artistExists) {
      throw new NotFound('El artista no existe');
    }

    try {
      return await this.prisma.artist.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerError(
        'Ocurrió un error de nuestro lado, intentalo de nuevo luego',
      );
    }
  }
}
