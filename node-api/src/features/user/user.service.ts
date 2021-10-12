import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '@common/services';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  getUser(
    id: number,
  ): Promise<{ id: number; email: string; fullName: string }> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });
  }

  deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  updateUser(id: number, newUserData: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: newUserData,
    });
  }
}
