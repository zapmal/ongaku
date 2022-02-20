import {
  Controller,
  Post,
  UploadedFiles,
  UsePipes,
  Body,
  UseInterceptors,
  UseGuards,
  Req,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

import { multerImageOptions } from '@/internal/helpers';
import { JoiValidationPipe } from '@/internal/pipes';
import { AuthGuard, RoleGuard } from '@/internal/guards';
import { RequestWithEntity } from '@/internal/interfaces';
import { Role } from '@/internal/constants';

import { PlaylistService } from './playlist.service';
import { GetMyPlaylistsDTO, NewPlaylistDTO } from './playlist.dto';
import { getMyPlaylistsSchema, newPlaylistSchema } from './playlist.schemas';

@Controller('playlist')
export class PlaylistController {
  constructor(private playlist: PlaylistService, private config: ConfigService) {}

  @Post('new')
  @UsePipes(new JoiValidationPipe(newPlaylistSchema))
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'cover',
          maxCount: 1,
        },
        {
          name: 'background',
          maxCount: 1,
        },
      ],
      { ...multerImageOptions },
    ),
  )
  async create(
    @Req() request: RequestWithEntity,
    @Body() { name }: NewPlaylistDTO,
    @UploadedFiles()
    uploadedImages: Array<Express.Multer.File>,
  ) {
    const { playlistName, errorStoringImages } = await this.playlist.create(
      name,
      uploadedImages,
      Number(request.entity.id),
    );

    const message = `Playlist "${playlistName}" creada exitosamente`;

    return {
      message: errorStoringImages
        ? `${message}, pero ha ocurrido un error al subir la imágen, inténtelo de nuevo luego`
        : message,
    };
  }

  @Get('all')
  @UseGuards(RoleGuard([Role.ADMIN, Role.USER]))
  @UsePipes(new JoiValidationPipe(getMyPlaylistsSchema))
  async getMyPlaylists(
    @Req() request: RequestWithEntity,
    @Body() { entityId }: GetMyPlaylistsDTO,
  ) {
    const playlists = await this.playlist.getAll(entityId);

    return {
      message: 'Playlists encontradas exitosamente',
      playlists,
    };
  }

  @Delete(':id')
  @UseGuards(RoleGuard([Role.ADMIN, Role.USER]))
  async delete(@Param() { id }, @Req() request: RequestWithEntity) {
    const entity = request.entity;

    await this.playlist.delete(Number(id), Number(entity.id), entity.role as Role);

    return {
      message: 'Prueba',
    };
  }
}
