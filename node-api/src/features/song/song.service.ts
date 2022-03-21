import { PrismaService } from '@/internal/services';
import {
  BadRequestException as BadRequest,
  InternalServerErrorException as InternalServerError,
  Injectable,
  NotFoundException as NotFound,
} from '@nestjs/common';
import { Prisma, Song } from '@prisma/client';
import * as hash from 'object-hash';
import { writeFile, unlink } from 'fs';
import { extname } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SongService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async getLatest(entityId: number) {
    const songs = await this.prisma.song.findMany({
      include: {
        album: {
          select: { id: true, name: true, cover: true, year: true },
        },
        interaction: {
          where: {
            userId: entityId,
            albumId: undefined,
            userPlaylistId: undefined,
            artistId: undefined,
          },
          select: {
            value: true,
          },
        },
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
      },
      orderBy: {
        id: 'desc',
      },
      take: 4,
    });

    if (songs.length === 0) {
      throw new NotFound('No se encontraron canciones');
    }

    return songs;
  }

  async update(
    id: number,
    newData: Prisma.SongUpdateInput,
    collaborators: Array<string>,
  ) {
    try {
      return await this.prisma.song.update({
        where: { id },
        data: {
          ...newData,
          collaborators,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerError(
        'Ocurrió un error de nuestro lado, intentalo de nuevo luego',
      );
    }
  }

  async getAll(artistId: number) {
    let songs;

    if (artistId) {
      songs = await this.prisma.song.findMany({ where: { artistId } });
    } else {
      songs = await this.prisma.song.findMany();
    }

    if (songs.length === 0) throw new NotFound('No se encontraron canciones');

    return songs;
  }

  async getById(id: number) {
    if (!id) throw new BadRequest('La solicitud está errada, falta información');

    const song = await this.prisma.song.findUnique({
      where: { id },
    });

    if (!song) throw new NotFound('La canción no existe');

    return song;
  }

  async delete(id: number): Promise<Song> {
    await this.getById(id);

    try {
      return await this.prisma.song.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerError(
        'Ocurrió un error de nuestro lado, intentalo de nuevo luego',
      );
    }
  }

  async create(data, song: Express.Multer.File) {
    const path = `${this.config.get('UPLOADED_FILES_DESTINATION')}/song`;
    let filenameForDeletion = '';

    try {
      const [filename, error] = this.storeFile(song, path);

      filenameForDeletion = filename as string;

      if (error) {
        unlink(`${path}/${filenameForDeletion}`, (error) => {
          if (error) {
            console.log('Error borrando el residuo de la canción');
          }
        });
      }

      const { albumId, artistId, isExplicit, collaborators, ...songData } = data;

      return await this.prisma.song.create({
        data: {
          albumId: Number(albumId),
          artistId: Number(artistId),
          isExplicit: isExplicit === 'true',
          collaborators: collaborators
            .split(',')
            .map((collaborator) => collaborator.trim()),
          path: (filename as string) || '',
          ...songData,
        },
      });
    } catch (error) {
      unlink(`${path}/${filenameForDeletion}`, (error) => {
        if (error) {
          console.log('Error borrando el residuo de la canción');
        }
      });

      console.log(error);

      throw new InternalServerError(
        'Ocurrió un error inesperado mientras creabamos el album, intentalo de nuevo luego',
      );
    }
  }

  private storeFile(fileToStore: Express.Multer.File, destination: string) {
    const filename = hash(fileToStore.originalname);
    const extension = extname(fileToStore.originalname);
    const file = `${filename}${extension}`;

    let error = false;

    writeFile(`${destination}/${file}`, fileToStore.buffer, (err) => {
      if (err) {
        console.log('Error guardando la canción', err);
        error = true;
      }
    });

    return [file, error];
  }

  async like(songId: number, entityId: number) {
    try {
      const foundSong = await this.prisma.song.findUnique({
        where: {
          id: songId,
        },
        include: {
          interaction: {
            where: {
              userId: entityId,
              songId: songId,
            },
            select: {
              id: true,
              value: true,
            },
          },
        },
      });

      if (!foundSong?.id) {
        throw new NotFound('La canción a la que intentas darle like no existe');
      }

      const isLiked = Boolean(foundSong.interaction[0]?.value);

      const likeResult = await this.prisma.interaction.upsert({
        where: { id: foundSong.interaction[0]?.id || 0 },
        update: {
          value: !isLiked,
        },
        create: {
          value: !isLiked,
          userId: entityId,
          songId: songId,
        },
      });

      return likeResult.value;
    } catch (error) {
      throw new InternalServerError(
        'Ocurrió un error inesperado mientras registrabamos tu like, intentalo más tarde',
      );
    }
  }

  async isLiked(songId: number, entityId: number) {
    if (!songId) throw new BadRequest('La solicitud está errada, falta información');

    const song = await this.prisma.song.findUnique({
      where: { id: songId },
      include: {
        interaction: {
          where: { userId: entityId, value: true },
          select: {
            value: true,
          },
        },
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
      },
    });

    if (!song) throw new NotFound('La canción no existe');

    return {
      song: song,
      isLiked: song.interaction.length === 0 ? false : song.interaction[0].value,
    };
  }

  async getLiked(entityId: number): Promise<any> {
    const likedSongs = await this.prisma.interaction.findMany({
      where: {
        value: true,
        userId: entityId,
        artistId: null,
        albumId: null,
        userPlaylistId: null,
      },
      include: {
        song: {
          include: {
            album: true,
            interaction: {
              where: {
                albumId: undefined,
                userPlaylistId: undefined,
                artistId: undefined,
                userId: entityId,
              },
              select: { value: true },
            },
            artist: {
              include: { band: true },
            },
          },
        },
      },
    });

    const user = await this.prisma.user.findUnique({ where: { id: entityId } });

    if (!user) throw new NotFound('El usuario no existe');

    return [user, likedSongs];
  }
}
