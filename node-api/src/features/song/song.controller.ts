import { RequestWithEntity } from '@/internal/interfaces';
import {
  BadRequestException as BadRequest,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UnauthorizedException as Unauthorized,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';

import { Role } from '@/internal/constants';
import { RoleGuard } from '@/internal/guards';
import { JoiValidationPipe } from '@/internal/pipes';

import { UpdateSongDTO, NewSongDTO, LikeSongDTO } from './song.dto';
import { SongService } from './song.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { likeSongSchema } from './song.schemas';

@Controller('song')
@UseGuards(RoleGuard([Role.ADMIN, Role.ARTIST, Role.USER]))
export class SongController {
  constructor(
    private song: SongService,
    private album: AlbumService,
    private artist: ArtistService,
    private config: ConfigService,
  ) {}

  @Put('like')
  @UsePipes(new JoiValidationPipe(likeSongSchema))
  async like(@Req() request: RequestWithEntity, @Body() { songId }: LikeSongDTO) {
    const likedSong = await this.song.like(songId, Number(request.entity.id));

    return {
      message: likedSong
        ? 'Canción agregada a tus favoritos exitosamente'
        : 'La canción ha sido removida de tus favoritos',
    };
  }

  @Get('liked/:id')
  async isLiked(@Req() request: RequestWithEntity, @Param('id') songId) {
    return await this.song.isLiked(Number(songId), Number(request.entity.id));
  }

  @Get('liked')
  async getLiked(@Req() request: RequestWithEntity) {
    const [user, likedSongs] = await this.song.getLiked(Number(request.entity.id));

    return {
      user,
      name: 'Canciones Favoritas',
      background: null,
      songsInPlaylist: likedSongs.map(({ value, song }) => ({
        song: { ...song, isLiked: value },
      })),
    };
  }

  @Get('all')
  async getAll(@Body() { artistId }: { artistId: number }) {
    return await this.song.getAll(artistId);
  }

  @Get('latest')
  async getLatest(@Req() request: RequestWithEntity) {
    return await this.song.getLatest(Number(request.entity.id));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.song.delete(id);

    return { message: 'Canción eliminado exitosamente' };
  }

  @Put('edit')
  async update(@Body() newSongData: UpdateSongDTO, @Req() request: RequestWithEntity) {
    if (
      request.entity.role === Role.ARTIST &&
      request.entity.id !== Number(newSongData.artistId)
    ) {
      throw new Unauthorized('No tienes permiso para realizar esta acción');
    }

    const { id, collaborators, ...data } = newSongData;

    await this.song.update(
      Number(id),
      data,
      collaborators.split(',').map((collaborator) => collaborator.trim()),
    );

    return { message: 'Actualizado exitosamente' };
  }

  @Post('new')
  @UseInterceptors(FileInterceptor('song'))
  async create(
    @Req() request: RequestWithEntity,
    @Body() newSongData: NewSongDTO,
    @UploadedFile() song: Express.Multer.File,
  ) {
    if (!newSongData.albumId) {
      throw new BadRequest('Debes proveer la ID del album obligatoriamente');
    }

    await this.album.getById(Number(newSongData.albumId));

    if (!newSongData.artistId) {
      throw new BadRequest('Debes proveer la ID del artista obligatoriamente');
    }

    await this.artist.getImagesById(Number(newSongData.artistId));

    const storedSong = await this.song.create(newSongData, song);

    return { message: 'Canción subida exitosamente', storedSong };
  }
}
