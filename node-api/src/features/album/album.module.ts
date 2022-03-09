import { Module } from '@nestjs/common';

import { PrismaService } from '@/internal/services';

import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { ArtistModule } from '../artist';

@Module({
  imports: [ArtistModule],
  providers: [AlbumService, PrismaService],
  controllers: [AlbumController],
  exports: [AlbumService],
})
export class AlbumModule {}
