import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';

import { Role } from '@/internal/constants';
import { RoleGuard } from '@/internal/guards';

import { ArtistService } from './artist.service';
import { RequestWithEntity } from '@/internal/interfaces';

@Controller()
@UseGuards(RoleGuard([Role.ADMIN, Role.USER, Role.ARTIST]))
export class ArtistController {
  constructor(private readonly artist: ArtistService) {}

  @Get('artist/favorites')
  async getMyFavorites(@Req() request: RequestWithEntity) {
    return {
      entity: request.entity,
    };
  }
}
