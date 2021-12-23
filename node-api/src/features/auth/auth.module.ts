import { Module } from '@nestjs/common';
import { PrismaService } from '@/internal/services';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { MailModule } from '../mail';
import { UserModule } from '../user';
import { ArtistModule } from '../artist';

@Module({
  imports: [MailModule, UserModule, ArtistModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
