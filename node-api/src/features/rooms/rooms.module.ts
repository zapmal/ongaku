import { Module } from '@nestjs/common';

import { PrismaService } from '@/internal/services';

import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, PrismaService],
})
export class RoomsModule {}
