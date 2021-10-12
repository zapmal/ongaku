import { Module } from '@nestjs/common';

import { UserModule } from '@features/user';
import { AuthModule } from '@features/auth';

@Module({
  imports: [UserModule, AuthModule],
})
export class AppModule {}
