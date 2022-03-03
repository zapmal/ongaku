import { PrismaService } from '@/internal/services';
import {
  Injectable,
  InternalServerErrorException as InternalServerError,
  NotFoundException as NotFound,
  BadRequestException as BadRequest,
} from '@nestjs/common';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async like(albumId: number, entityId: number) {
    try {
      const foundAlbum = await this.prisma.album.findUnique({
        where: {
          id: albumId,
        },
        include: {
          interaction: {
            where: {
              userId: entityId,
              albumId: albumId,
            },
            select: {
              id: true,
              value: true,
            },
          },
        },
      });

      if (!foundAlbum?.id) {
        throw new NotFound('El album al que intentas darle like no existe');
      }

      const isLiked = Boolean(foundAlbum.interaction[0]?.value);

      const likeResult = await this.prisma.interaction.upsert({
        where: { id: foundAlbum.interaction[0]?.id || 0 },
        update: {
          value: !isLiked,
        },
        create: {
          value: !isLiked,
          userId: entityId,
          albumId: albumId,
        },
      });

      return likeResult.value;
    } catch (error) {
      throw new InternalServerError(
        'Ocurrió un error inesperado mientras registrabamos tu like, intentalo más tarde',
      );
    }
  }

  async isLiked(albumId: number, entityId: number) {
    if (!albumId) throw new BadRequest('La solicitud está errada, falta información');

    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
      select: {
        interaction: {
          where: { userId: entityId, value: true },
          select: {
            value: true,
          },
        },
      },
    });

    if (!album) throw new NotFound('El album no existe');

    return album.interaction.length === 0 ? false : album.interaction[0].value;
  }

  async getLiked(entityId: number) {
    return await this.prisma.interaction.findMany({
      where: {
        value: true,
        userId: entityId,
        artistId: null,
        songId: null,
        userPlaylistId: null,
      },
      select: {
        album: {
          include: {
            artist: {
              select: {
                artisticName: true,
                band: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
