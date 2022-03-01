import { Module } from '@nestjs/common';

import { PrismaService } from '@/internal/services';

import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';

@Module({
  providers: [AlbumService, PrismaService],
  controllers: [AlbumController],
})
export class AlbumModule {}
