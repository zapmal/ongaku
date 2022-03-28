import {
  Injectable,
  InternalServerErrorException as InternalServerError,
  NotFoundException as NotFound,
  BadRequestException as BadRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Album } from '@prisma/client';

import { storeImages } from '@/internal/helpers';
import { PrismaService } from '@/internal/services';
import { NewAlbumDTO } from './album.dto';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async getById(id: number) {
    if (!id) throw new BadRequest('La solicitud está errada, falta información');

    const album = await this.prisma.album.findUnique({
      where: { id },
      include: {
        artist: {
          include: {
            band: true,
          },
        },
        song: {
          include: {
            album: true,
            artist: {
              include: {
                band: true,
              },
            },
          },
        },
      },
    });

    if (!album) throw new NotFound('El Album/Ep/Single no existe');

    return album;
  }

  async update(
    id: number,
    newAlbumData,
    cover?: { file: Express.Multer.File; path: string },
  ) {
    let coverUpdate = {};

    try {
      if (cover.file) {
        const [image] = storeImages(cover.file, cover.path);
        coverUpdate = { cover: image };
      }

      return await this.prisma.album.update({
        where: { id },
        data: {
          ...newAlbumData,
          ...coverUpdate,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerError(
        'Ocurrió un error de nuestro lado, intentalo de nuevo luego',
      );
    }
  }

  async create(data: NewAlbumDTO, cover: Express.Multer.File) {
    try {
      const path = `${this.config.get('UPLOADED_FILES_DESTINATION')}/album`;
      const [storedCover, errorStoringImage] = storeImages(cover, path);

      const album = await this.prisma.album.create({
        data: {
          ...data,
          cover: (storedCover as string) || 'default_album.png',
        },
      });

      return {
        name: album.name,
        errorStoringImage,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerError(
        'Ocurrió un error inesperado mientras creabamos el album, intentalo de nuevo luego',
      );
    }
  }

  async getAll() {
    const albums = await this.prisma.album.findMany();

    if (albums.length === 0) throw new NotFound('No se encontraron albumes');

    return albums;
  }

  async delete(id: number): Promise<Album> {
    await this.getById(id);

    try {
      return await this.prisma.album.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerError(
        'Ocurrió un error de nuestro lado, intentao de nuevo luego',
      );
    }
  }

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
            id: true,
            value: true,
          },
        },
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
              select: {
                id: true,
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
        },
      },
    });

    if (!album) throw new NotFound('El album no existe');

    return {
      isLiked: album.interaction.length === 0 ? false : album.interaction[0].value,
      songs: album.song,
    };
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
        },
      },
    });
  }
}
