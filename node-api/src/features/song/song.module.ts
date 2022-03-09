import { Module } from '@nestjs/common';

import { PrismaService } from '@/internal/services';

import { SongService } from './song.service';
import { SongController } from './song.controller';
import { AlbumModule } from '../album';
import { ArtistModule } from '../artist';

@Module({
  imports: [AlbumModule, ArtistModule],
  controllers: [SongController],
  providers: [SongService, PrismaService],
})
export class SongModule {}
