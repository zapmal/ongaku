import { storeImages } from '@/internal/helpers';
import { PrismaService } from '@/internal/services';
import {
  Injectable,
  BadRequestException as BadRequest,
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

  async likePlaylist(playlistId: number, entityId: number) {
    if (!playlistId) {
      throw new BadRequest('Hubo un error en tu solicitud, intentalo más tarde');
    }

    const foundPlaylist = await this.prisma.userPlaylist.findUnique({
      where: {
        id: playlistId,
      },
      include: {
        interaction: {
          where: {
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
  }

  async getAll(entityId: number) {
    if (!entityId) {
      throw new BadRequest('Hubo un error en tu solicitud, intentalo más tarde');
    }

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

    const parsedPlaylists = playlists.map(
      ({ id, cover, name, likes, user: { username } }) => ({
        id,
        cover,
        name,
        likes,
        username,
      }),
    );
    const liked = likedPlaylists.map(({ user: { username }, userPlaylist }) => {
      return { ...userPlaylist, username };
    });

    return { playlists: parsedPlaylists, liked };
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
