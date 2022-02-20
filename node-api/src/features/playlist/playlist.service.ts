import { storeImages } from '@/internal/helpers';
import { PrismaService } from '@/internal/services';
import {
  Injectable,
  InternalServerErrorException as InternalServerError,
  NotFoundException as NotFound,
  UnauthorizedException as Unauthorized,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';

import { DEFAULT_PLAYLIST_IMAGES } from './playlist.constants';

@Injectable()
export class PlaylistService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async create(
    name: string,
    uploadedImages: Array<Express.Multer.File>,
    entityId: number,
  ) {
    try {
      const path = `${this.config.get('UPLOADED_FILES_DESTINATION')}/playlist`;
      const [images, errorStoringImages] = storeImages(uploadedImages, path, true);

      const playlist = await this.prisma.userPlaylist.create({
        data: {
          background: images['background'] || DEFAULT_PLAYLIST_IMAGES['background'],
          cover: images['cover'] || DEFAULT_PLAYLIST_IMAGES['cover'],
          name,
          userId: entityId,
        },
      });

      return {
        playlistName: playlist.name,
        errorStoringImages,
      };
    } catch (error) {
      throw new InternalServerError(
        'Something went wrong while trying to create the playlist, try again later',
      );
    }
  }

  async getAll(entityId: number) {
    return await this.prisma.userPlaylist.findMany({
      where: {
        userId: entityId,
      },
      include: {
        interaction: {
          where: {
            userId: entityId,
            likedPlaylist: true,
          },
        },
      },
    });
  }

  async delete(playlistId: number, entityId: number, role: Role) {
    const playlist = await this.prisma.userPlaylist.findUnique({
      where: { id: playlistId },
      select: {
        userId: true,
      },
    });

    if (!playlist?.userId) {
      throw new NotFound('La playlist no existe');
    }

    if (playlist?.userId === 2 || role === 'ADMIN') {
      await this.prisma.userPlaylist.delete({
        where: {
          id: playlistId,
        },
      });
    } else {
      throw new Unauthorized('No tienes permiso para borrar esta playlist');
    }
  }
}
