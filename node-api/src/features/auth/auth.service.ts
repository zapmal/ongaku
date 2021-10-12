import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '@common/services';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signup(userData: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data: userData });
  }

  getUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: { email: email },
    });
  }
}
