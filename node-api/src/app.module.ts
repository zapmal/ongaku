import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from '@/features/user';
import { AuthModule } from '@/features/auth';
import { PlaylistModule } from '@/features/playlist';
import { SearchModule } from '@/features/search';
import { AlbumModule } from '@/features/album';
import { SongModule } from './features/song/song.module';

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
  ],
})
export class AppModule {}
