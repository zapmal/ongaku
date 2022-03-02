import { Module } from '@nestjs/common';

import { PrismaService } from '@/internal/services';

import { PlaylistModule } from '../playlist';
import { ArtistModule } from '../artist';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PlaylistModule, ArtistModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
