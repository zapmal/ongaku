import { Module } from '@nestjs/common';

import { PrismaService } from '@/internal/services';

import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';

@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService, PrismaService],
  exports: [PlaylistService],
})
export class PlaylistModule {}
