import { Body, Controller, Get, Put, Req, UseGuards, UsePipes } from '@nestjs/common';

import { Role } from '@/internal/constants';
import { RoleGuard } from '@/internal/guards';
import { RequestWithEntity } from '@/internal/interfaces';
import { JoiValidationPipe } from '@/internal/pipes';

import { ArtistService } from './artist.service';
import { FollowArtistDTO } from './artist.dto';
import { followArtistSchema } from './artist.schemas';

@Controller('artist')
@UseGuards(RoleGuard([Role.ADMIN, Role.USER, Role.ARTIST]))
export class ArtistController {
  constructor(private readonly artist: ArtistService) {}

  @Get('followed')
  async getFollowed(@Req() request: RequestWithEntity) {
    const followedArtists = await this.artist.getFollowed(Number(request.entity.id));

    return followedArtists.map(({ artist }) => {
      return {
        id: artist.id,
        artisticName: artist.artisticName,
        bandName: artist.band ? artist.band.name : null,
        followers: artist.artistMetrics.followers,
      };
    });
  }

  @Put('follow')
  @UsePipes(new JoiValidationPipe(followArtistSchema))
  async follow(@Req() request: RequestWithEntity, @Body() { artistId }: FollowArtistDTO) {
    const followedArtist = await this.artist.follow(artistId, Number(request.entity.id));

    return {
      message: followedArtist
        ? 'Artista agregado a tu lista de seguidos'
        : 'Artista removido de tu lista de seguidos',
    };
  }
}
