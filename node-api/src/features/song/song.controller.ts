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
} from '@nestjs/common';

import { Role } from '@/internal/constants';
import { RoleGuard } from '@/internal/guards';

import { UpdateSongDTO, NewSongDTO } from './song.dto';
import { SongService } from './song.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { ConfigService } from '@nestjs/config';

@Controller('song')
@UseGuards(RoleGuard([Role.ADMIN, Role.ARTIST]))
export class SongController {
  constructor(
    private song: SongService,
    private album: AlbumService,
    private artist: ArtistService,
    private config: ConfigService,
  ) {}

  @Get('all')
  async getAll(@Body() { artistId }: { artistId: number }) {
    return await this.song.getAll(artistId);
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
