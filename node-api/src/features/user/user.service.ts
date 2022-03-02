import {
  Injectable,
  InternalServerErrorException as InternalServerError,
} from '@nestjs/common';
import { Prisma, User, UserMetadata } from '@prisma/client';

import { PrismaService } from '@/internal/services';
import { PrismaError } from '@/internal/constants';

import { UserNotFound } from './user.exceptions';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async delete(id: number): Promise<User> {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      this.handleIdSearchError(error);
    }
  }

  async update(id: number, newUserData: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: newUserData,
      });
    } catch (error) {
      this.handleIdSearchError(error);
    }
  }

  async updateMetadata(
    id: number,
    newMetadata: Prisma.UserMetadataUpdateInput,
  ): Promise<UserMetadata> {
    try {
      return await this.prisma.userMetadata.update({
        where: { id },
        data: newMetadata,
      });
    } catch (error) {
      this.handleIdSearchError(error);
    }
  }

  private handleIdSearchError(error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PrismaError.RecordDoesNotExist
    ) {
      throw new UserNotFound();
    }
    throw new InternalServerError('Something went wrong, try again later');
  }

  getById(id: number): Promise<{ id: number; email: string; fullName: string }> {
    const user = this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });

    if (!user) throw new UserNotFound();

    return user;
  }

  getByEmail(email: string): Promise<User> {
    const user = this.prisma.user.findFirst({
      where: { email: email },
      include: {
        userMetadata: {
          select: {
            verifiedEmail: true,
          },
        },
      },
    });

    if (!user) throw new UserNotFound();

    return user;
  }

  async getByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        password: false,
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatar: true,
        background: true,
        role: true,
        userMetadata: true,
      },
    });

    if (!user) throw new UserNotFound();

    return user;
  }

  async getLikedAndFollowed(id: number) {
    // return await this.prisma.user.findUnique({
    //   where: { id },
    //   select: {
    //     userPlaylist: true,
    //     interaction: {
    //       where: {
    //         OR: [
    //           {
    //             userPlaylistId: {
    //               not: null,
    //             },
    //           },
    //           {
    //             artistId: {
    //               not: null,
    //             },
    //           },
    //         ],
    //       },
    //     },
    //   },
    // });
  }
}
