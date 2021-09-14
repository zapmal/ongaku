import { Module } from '@nestjs/common';

import { UserModule } from './components/user/user.module';
import { AuthModule } from './components/auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
})
export class AppModule {}
