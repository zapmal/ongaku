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
}

/// for authors query maybe(?)
// const condition = [];
// for (const collaborator of collaborators) {
//   condition.push(
//     { artisticName: collaborator.trim() },
//     { band: { name: collaborator.trim() } },
//   );
// }

// const artistsIds = await this.prisma.artist.findMany({
//   where: {
//     OR: condition,
//   },
//   select: {
//     id: true,
//   },
// });

// console.log('artists', artistsIds);
