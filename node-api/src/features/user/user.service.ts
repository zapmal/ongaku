import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '@/internal/services';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  getById(id: number): Promise<{ id: number; email: string; fullName: string }> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });
  }

  delete(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  update(id: number, newUserData: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: newUserData,
    });
  }

  getByEmail(email: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: { email: email },
    });
  }

  getByUsername(username: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: { username: username },
    });
  }
}
