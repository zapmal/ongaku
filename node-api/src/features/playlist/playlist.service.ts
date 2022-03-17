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

  async isLiked(playlistId: number, entityId: number) {
    if (!playlistId) throw new BadRequest('La solicitud está errada, falta información');

    const playlist = await this.prisma.userPlaylist.findUnique({
      where: { id: playlistId },
      select: {
        interaction: {
          where: { userId: entityId, value: true },
          select: {
            value: true,
          },
        },
        songsInPlaylist: {
          include: {
            song: {
              include: {
                artist: {
                  select: {
                    id: true,
                    artisticName: true,
                    band: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                album: {
                  select: {
                    id: true,
                    name: true,
                    cover: true,
                  },
                },
                interaction: {
                  where: {
                    albumId: undefined,
                    userPlaylistId: undefined,
                    artistId: undefined,
                    userId: entityId,
                  },
                  select: {
                    value: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!playlist) throw new NotFound('La playlist no existe');

    return {
      isLiked: playlist.interaction.length === 0 ? false : playlist.interaction[0].value,
      songs: playlist.songsInPlaylist.map(({ song }) => ({ ...song })),
    };
  }

  async getById(id: number) {
    if (!id) throw new BadRequest('La solicitud está errada, falta información');

    const playlist = await this.prisma.userPlaylist.findUnique({
      where: { id },
      include: {
        user: true,
        songsInPlaylist: {
          include: {
            song: {
              include: {
                artist: {
                  select: {
                    artisticName: true,
                    band: { select: { name: true } },
                  },
                },
                album: { select: { cover: true, name: true } },
              },
            },
          },
        },
      },
    });

    if (!playlist) throw new NotFound('El Album/Ep/Single no existe');

    return playlist;
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

    // change this lol
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

  async addSong(playlistId: number, songId: number) {
    const songExists = await this.prisma.song.findUnique({
      where: { id: songId },
    });

    if (!songExists) {
      throw new NotFound('La canción no existe');
    }

    const isInPlaylist = await this.prisma.songsInPlaylist.findFirst({
      where: {
        songId,
        userPlaylistId: playlistId,
      },
    });

    if (isInPlaylist) {
      throw new BadRequest('La canción ya está en la playlist');
    }

    const songInPlaylist = await this.prisma.songsInPlaylist.create({
      data: {
        songId,
        userPlaylistId: playlistId,
      },
    });

    return songInPlaylist;
  }

  async removeSong(playlistId: number, songId: number) {
    const isInPlaylist = await this.prisma.songsInPlaylist.findFirst({
      where: {
        songId,
        userPlaylistId: playlistId,
      },
    });

    if (!isInPlaylist) {
      throw new BadRequest('La canción que intentas borrar no está en la playlist');
    }

    return await this.prisma.songsInPlaylist.deleteMany({
      where: {
        songId,
        userPlaylistId: playlistId,
      },
    });
  }

  async addAlbum(playlistId: number, albumId: number) {
    const playlistExists = await this.prisma.userPlaylist.findUnique({
      where: {
        id: playlistId,
      },
    });

    if (!playlistExists) {
      throw new NotFound('La playlist no existe');
    }

    const songs = await this.prisma.album.findUnique({
      where: { id: albumId },
      include: {
        song: {
          select: {
            id: true,
          },
        },
      },
    });

    if (songs.song.length === 0) {
      throw new BadRequest('El album no contiene ninguna canción, no puede ser agregado');
    }

    const condition = songs.song.map((song) => ({
      songId: song.id,
    }));

    const isInPlaylist = await this.prisma.songsInPlaylist.findMany({
      where: {
        AND: condition,
      },
    });

    if (isInPlaylist.length !== 0) {
      throw new BadRequest('El album ya está en la playlist');
    }

    const data = songs.song.map((song) => ({
      songId: song.id,
      userPlaylistId: playlistId,
    }));

    const count = await this.prisma.songsInPlaylist.createMany({
      data: data,
      skipDuplicates: true,
    });

    return count;
  }
}
