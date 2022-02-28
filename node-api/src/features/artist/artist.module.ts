import { Module } from '@nestjs/common';
import { PrismaService } from '@/internal/services';

import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';

@Module({
  providers: [ArtistService, PrismaService],
  controllers: [ArtistController],
  exports: [ArtistService],
})
export class ArtistModule {}
