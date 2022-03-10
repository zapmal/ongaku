import {
  Controller,
  Req,
  Param,
  UsePipes,
  Body,
  Put,
  UseGuards,
  Get,
  UseInterceptors,
  UploadedFile,
  UnauthorizedException as Unauthorized,
  InternalServerErrorException as InternalServerError,
  Post,
  BadRequestException as BadRequest,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, unlink } from 'fs';
import * as dayjs from 'dayjs';

import { RequestWithEntity } from '@/internal/interfaces';
import { JoiValidationPipe } from '@/internal/pipes';
import { multerImageOptions } from '@/internal/helpers';
import { RoleGuard } from '@/internal/guards';
import { Role } from '@/internal/constants';

import { LikeAlbumDTO, NewAlbumDTO, UpdateAlbumDTO } from './album.dto';
import { likeAlbumSchema } from './album.schemas';
import { AlbumService } from './album.service';
import { ArtistService } from '../artist/artist.service';

@Controller('album')
@UseGuards(RoleGuard([Role.ADMIN, Role.USER, Role.ARTIST]))
export class AlbumController {
  constructor(
    private album: AlbumService,
    private config: ConfigService,
    private artist: ArtistService,
  ) {}

  @Put('like')
  @UsePipes(new JoiValidationPipe(likeAlbumSchema))
  async like(@Req() request: RequestWithEntity, @Body() { albumId }: LikeAlbumDTO) {
    const likedAlbum = await this.album.like(albumId, Number(request.entity.id));

    return {
      message: likedAlbum
        ? 'Album agregado a tus favoritos exitosamente'
        : 'El album ha sido removido de tus favoritos',
    };
  }

  @Get('liked/:id')
  async isLiked(@Req() request: RequestWithEntity, @Param('id') albumId) {
    return await this.album.isLiked(Number(albumId), Number(request.entity.id));
  }

  @Get('liked')
  async getLiked(@Req() request: RequestWithEntity) {
    const likedAlbums = await this.album.getLiked(Number(request.entity.id));

    return likedAlbums.map(({ album }) => {
      return {
        ...album,
        artist: {
          artisticName: album.artist.artisticName,
          bandName: album.artist.band.name,
        },
      };
    });
  }

  @Get('all')
  async getAll() {
    return await this.album.getAll();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.album.delete(id);

    return { message: 'Album eliminado exitosamente' };
  }

  @Post('new')
  @UseInterceptors(FileInterceptor('cover', { ...multerImageOptions }))
  async create(
    @Req() request: RequestWithEntity,
    @Body() newAlbumdata: NewAlbumDTO,
    @UploadedFile() cover: Express.Multer.File,
  ) {
    if (!newAlbumdata.artistId) {
      throw new BadRequest('Debes proveer la ID del artista obligatoriamente');
    }

    const { artistId, year, ...data } = newAlbumdata;

    await this.artist.getImagesById(Number(artistId));

    const { name, errorStoringImage } = await this.album.create(
      {
        ...data,
        year: dayjs(year).toDate(),
        artistId: Number(artistId),
      },
      cover,
    );
    const message = `Album "${name}" creado exitosamente`;

    return {
      message: errorStoringImage
        ? `${message}, pero ha ocurrido un error al subir la portada, inténtelo de nuevo luego`
        : message,
    };
  }

  @Put('edit')
  @UseInterceptors(FileInterceptor('cover', { ...multerImageOptions }))
  async update(
    @Body() newAlbumData: UpdateAlbumDTO,
    @Req() request: RequestWithEntity,
    @UploadedFile() newCover: Express.Multer.File,
  ) {
    if (
      request.entity.role === Role.ARTIST &&
      request.entity.id !== Number(newAlbumData.artistId)
    ) {
      throw new Unauthorized('No tienes permiso para realizar esta acción');
    }
    const { cover: existingCover } = await this.album.getById(Number(newAlbumData.id));
    const path = `${this.config.get('UPLOADED_FILES_DESTINATION')}/album`;

    if (existingCover && existsSync(`${path}/${existingCover}`) && newCover) {
      unlink(`${path}/${existingCover}`, (error) => {
        if (error) {
          throw new InternalServerError(
            'Ocurrió un error de nuestro lado mientras actualizabamos la portada',
          );
        }
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, cover, year, artistId, ...data } = newAlbumData;

    await this.album.update(
      Number(id),
      {
        ...data,
        artistId: Number(artistId),
        year: dayjs(year).toDate(),
      },
      {
        file: newCover,
        path,
      },
    );

    return { message: 'Actualizado exitosamente' };
  }
}
