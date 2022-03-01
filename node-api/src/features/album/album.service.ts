import { PrismaService } from '@/internal/services';
import {
  Injectable,
  InternalServerErrorException as InternalServerError,
  NotFoundException as NotFound,
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

  async getLiked(entityId: number) {
    return await this.prisma.interaction.findMany({
      where: {
        value: true,
        userId: entityId,
        artistId: null,
        songId: null,
        userPlaylistId: null,
      },
      include: {
        album: true,
      },
    });
  }
}
