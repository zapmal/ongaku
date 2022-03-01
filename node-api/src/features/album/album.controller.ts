import { Controller, Req, UsePipes, Body, Put, UseGuards, Get } from '@nestjs/common';

import { RequestWithEntity } from '@/internal/interfaces';
import { JoiValidationPipe } from '@/internal/pipes';
import { RoleGuard } from '@/internal/guards';
import { Role } from '@/internal/constants';

import { LikeAlbumDTO } from './album.dto';
import { likeAlbumSchema } from './album.schemas';
import { AlbumService } from './album.service';

@Controller('album')
@UseGuards(RoleGuard([Role.ADMIN, Role.USER, Role.ARTIST]))
export class AlbumController {
  constructor(private readonly album: AlbumService) {}

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

  @Get('liked')
  async getLiked(@Req() request: RequestWithEntity) {
    const likedAlbums = await this.album.getLiked(Number(request.entity.id));

    return likedAlbums.map(({ album }) => {
      return {
        ...album,
      };
    });
  }
}
