import {
  BadRequestException as BadRequest,
  Injectable,
  InternalServerErrorException as InternalServerError,
} from '@nestjs/common';
import { Prisma, User, UserMetadata } from '@prisma/client';
import { hash } from 'bcrypt';

import { PrismaService } from '@/internal/services';
import { PrismaError } from '@/internal/constants';
import { storeImages } from '@/internal/helpers';

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

  async update(
    id: number,
    newUserData: Prisma.UserUpdateInput,
    avatar?: { file: Express.Multer.File; path: string },
  ) {
    let passwordUpdate = {};

    if (newUserData.password) {
      passwordUpdate = { password: await hash(newUserData.password as string, 10) };
    }

    let avatarUpdate = {};

    try {
      if (avatar) {
        const [image] = storeImages(avatar.file, avatar.path);
        avatarUpdate = { avatar: image };
      }

      return await this.prisma.user.update({
        where: { id },
        data: {
          ...newUserData,
          ...passwordUpdate,
          ...avatarUpdate,
        },
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
    console.log(error);
    throw new InternalServerError('Something went wrong, try again later');
  }

  async getById(id: number) {
    if (!id) throw new BadRequest('La solicitud está errada, falta información');

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatar: true,
      },
    });

    if (!user) throw new UserNotFound();

    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
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
}
