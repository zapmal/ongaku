import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as helmet from 'helmet';

import { AppModule } from '@/app.module';
import { cookieOptions } from '@/internal/helpers';
import { PrismaService } from '@/internal/services';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const PORT = config.get<number>('PORT', 5000);

  const prisma: PrismaService = app.get(PrismaService);
  prisma.enableShutdownHooks(app);

  app.setGlobalPrefix('api');

  app.use(helmet());
  app.enableCors({
    origin: config.get('FRONTEND_URL'),
    credentials: true,
  });
  app.use(cookieParser());
  app.use(
    csurf({
      cookie: {
        ...cookieOptions,
        maxAge: 86400 * 90,
      },
    }),
  );

  await app.listen(PORT);
}

bootstrap();
