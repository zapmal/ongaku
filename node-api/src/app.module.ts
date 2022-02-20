import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from '@/features/user';
import { AuthModule } from '@/features/auth';
import { PlaylistModule } from '@/features/playlist';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    UserModule,
    AuthModule,
    PlaylistModule,
  ],
})
export class AppModule {}
