import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as helmet from 'helmet';

import { AppModule } from '@/app.module';
import { cookieOptions } from '@utils/cookie';
import { PrismaService } from '@common/services';

async function bootstrap() {
  const PORT = 4000 || process.env.PORT;
  const app = await NestFactory.create(AppModule);
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  app.setGlobalPrefix('api');

  app.use(helmet());
  app.enableCors({ origin: 'http://localhost:3000', credentials: true });
  app.use(cookieParser());
  app.use(csurf({ cookie: { ...cookieOptions } }));

  await app.listen(PORT);
}

bootstrap();
