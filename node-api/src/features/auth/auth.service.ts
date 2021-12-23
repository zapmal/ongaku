import { BadRequestException as BadRequest, Injectable } from '@nestjs/common';
import { Prisma, User, Artist } from '@prisma/client';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import * as dayjs from 'dayjs';

import { PrismaService } from '@/internal/services';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async createUser(user: Prisma.UserCreateInput & { ipAddress: string }) {
    const { ipAddress, password, birthdate, ...userData } = user;
    const hashedPassword = await hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        birthdate: dayjs(birthdate).toDate(),
        userMetadata: {
          create: {
            ipAddress,
            createdAt: new Date(),
            verifiedEmail: false,
            active: true,
          },
        },
      },
    });

    if (!newUser) {
      throw new BadRequest(
        'Something went wrong while trying to create the user, try again',
      );
    }

    const token = sign({ user: newUser }, this.config.get('JWT_SECRET'), {
      expiresIn: this.config.get('JWT_EXPIRY_TIME'),
    });

    return {
      message: 'Account created successfully!',
      token,
      user: newUser,
    };
  }

  createSoloArtist(artist: Prisma.ArtistCreateInput): Promise<Artist> {
    return this.prisma.artist.create({ data: artist });
  }

  createBand(artist: Prisma.ArtistCreateInput, band: Prisma.BandCreateInput) {
    return this.prisma.artist.create({
      data: {
        ...artist,
        band: {
          create: {
            ...band,
          },
        },
      },
    });
  }
}
