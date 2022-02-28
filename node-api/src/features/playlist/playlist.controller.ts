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
  Put,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

import { multerImageOptions } from '@/internal/helpers';
import { JoiValidationPipe } from '@/internal/pipes';
import { RoleGuard } from '@/internal/guards';
import { RequestWithEntity } from '@/internal/interfaces';
import { Role } from '@/internal/constants';

import { PlaylistService } from './playlist.service';
import { LikePlaylistDTO, NewPlaylistDTO } from './playlist.dto';
import { likePlaylistSchema, newPlaylistSchema } from './playlist.schemas';

@Controller('playlist')
@UseGuards(RoleGuard([Role.ADMIN, Role.USER]))
export class PlaylistController {
  constructor(private playlist: PlaylistService, private config: ConfigService) {}

  @Post('new')
  @UsePipes(new JoiValidationPipe(newPlaylistSchema))
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
        ? `${message}, pero ha ocurrido un error al subir una (o ambas) imágenes, inténtelo de nuevo luego`
        : message,
    };
  }

  @Put('like')
  @UsePipes(new JoiValidationPipe(likePlaylistSchema))
  async like(@Req() request: RequestWithEntity, @Body() { playlistId }: LikePlaylistDTO) {
    const likedPlaylist = await this.playlist.like(playlistId, Number(request.entity.id));

    return {
      message: likedPlaylist
        ? 'Playlist agregada a tus favoritas exitosamente'
        : 'La playlist ha sido removida de tus favoritos',
    };
  }

  @Get('liked')
  async getLiked(@Req() request: RequestWithEntity) {
    const playlists = await this.playlist.getLiked(Number(request.entity.id));

    return {
      message: 'Playlists encontradas exitosamente',
      ...playlists,
    };
  }

  @Delete(':id')
  async delete(@Param() { id }, @Req() request: RequestWithEntity) {
    const entity = request.entity;

    await this.playlist.delete(Number(id), Number(entity.id), entity.role as Role);

    return {
      message: 'Prueba',
    };
  }
}
