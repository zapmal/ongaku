import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as helmet from 'helmet';
import { join } from 'path';

import { AppModule } from '@/app.module';
import { cookieOptions } from '@/internal/helpers';
import { PrismaService } from '@/internal/services';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  const PORT = config.get<number>('PORT', 5000);

  const prisma: PrismaService = app.get(PrismaService);
  prisma.enableShutdownHooks(app);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: config.get('FRONTEND_URL'),
    credentials: true,
  });

  app.use(helmet());
  app.use(cookieParser());
  app.use(
    csurf({
      cookie: {
        ...cookieOptions,
        maxAge: 86400 * 90,
      },
    }),
  );
  app.useStaticAssets(join(__dirname, '../', 'assets'), { prefix: '/static' });

  await app.listen(PORT);
}

bootstrap();
