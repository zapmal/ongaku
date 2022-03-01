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
        'Ocurrió un error inesperado mientras creabamos la playlist, intentalo más tarde',
      );
    }
  }

  async like(playlistId: number, entityId: number) {
    try {
      const foundPlaylist = await this.prisma.userPlaylist.findUnique({
        where: {
          id: playlistId,
        },
        include: {
          interaction: {
            where: {
              userId: entityId,
              userPlaylistId: playlistId,
            },
            select: {
              id: true,
              value: true,
            },
          },
        },
      });

      if (!foundPlaylist?.id) {
        throw new NotFound('La playlist a la que intentas darle like no existe');
      }

      const isLiked = Boolean(foundPlaylist.interaction[0]?.value);
      const update = isLiked ? { decrement: 1 } : { increment: 1 };

      const likeResult = await this.prisma.interaction.upsert({
        where: { id: foundPlaylist.interaction[0]?.id || 0 },
        update: {
          value: !isLiked,
          userPlaylist: {
            update: {
              likes: {
                ...update,
              },
            },
          },
        },
        create: {
          value: !isLiked,
          userId: entityId,
          userPlaylistId: playlistId,
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
    const playlists = await this.prisma.userPlaylist.findMany({
      where: {
        userId: entityId,
      },
      select: {
        id: true,
        cover: true,
        name: true,
        likes: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    const likedPlaylists = await this.prisma.interaction.findMany({
      where: {
        value: true,
        userId: entityId,
        artistId: null,
        albumId: null,
        songId: null,
      },
      include: {
        userPlaylist: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return { playlists, likedPlaylists };
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
