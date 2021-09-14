import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { Prisma, Users as User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signup(userData: Prisma.UsersCreateInput): Promise<User> {
    return this.prisma.users.create({ data: userData });
  }

  getUserByEmail(email: string): Promise<User> {
    return this.prisma.users.findFirst({
      where: { email: email },
    });
  }
}
