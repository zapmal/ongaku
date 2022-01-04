import { Injectable, OnModuleInit } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.log('Prisma service init error', error);
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => await app.close());
  }

  // async onModuleDestroy() {
  //   await this.$disconnect();
  // }
}
