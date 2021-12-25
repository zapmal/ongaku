import { Module } from '@nestjs/common';
import { PrismaService } from '@/internal/services';

import { ArtistService } from './artist.service';

@Module({
  providers: [ArtistService, PrismaService],
  exports: [ArtistService],
})
export class ArtistModule {}
