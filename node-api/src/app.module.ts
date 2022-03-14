import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from '@/features/user';
import { AuthModule } from '@/features/auth';
import { PlaylistModule } from '@/features/playlist';
import { SearchModule } from '@/features/search';
import { AlbumModule } from '@/features/album';
import { SongModule } from '@/features/song';
import { RoomsModule } from '@/features/rooms';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    UserModule,
    AuthModule,
    PlaylistModule,
    SearchModule,
    AlbumModule,
    SongModule,
    RoomsModule,
  ],
})
export class AppModule {}
