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
import {
  AddAlbumToPlaylistDTO,
  AddSongToPlaylistDTO,
  LikePlaylistDTO,
  NewPlaylistDTO,
} from './playlist.dto';
import {
  addAlbumToPlaylistSchema,
  addSongToPlaylistSchema,
  likePlaylistSchema,
  newPlaylistSchema,
} from './playlist.schemas';

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
    const { playlists, likedPlaylists } = await this.playlist.getLiked(
      Number(request.entity.id),
    );

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

    return {
      message: 'Playlists encontradas exitosamente',
      playlists: [...parsedPlaylists],
      liked,
    };
  }

  @Get('liked/:id')
  async isLiked(@Req() request: RequestWithEntity, @Param('id') playlistId) {
    const isLiked = await this.playlist.isLiked(
      Number(playlistId),
      Number(request.entity.id),
    );

    return { isLiked };
  }

  @Get(':id')
  async getByIdWithSongs(@Param() { id }) {
    return await this.playlist.getById(Number(id));
  }

  @Delete(':id')
  async delete(@Param() { id }, @Req() request: RequestWithEntity) {
    const entity = request.entity;

    await this.playlist.delete(Number(id), Number(entity.id), entity.role as Role);
  }

  @Post('add-album')
  @UsePipes(new JoiValidationPipe(addAlbumToPlaylistSchema))
  async addAlbumToPlaylist(@Body() { playlistId, albumId }: AddAlbumToPlaylistDTO) {
    return await this.playlist.addAlbum(playlistId, albumId);
  }

  @Post('add-song')
  @UsePipes(new JoiValidationPipe(addSongToPlaylistSchema))
  async addSongToPlaylist(@Body() { playlistId, songId }: AddSongToPlaylistDTO) {
    return await this.playlist.addAlbum(playlistId, songId);
  }
}
