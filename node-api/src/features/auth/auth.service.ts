import {
  BadRequestException as BadRequest,
  UnauthorizedException as Unauthorized,
  NotFoundException as NotFound,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Artist, User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import * as dayjs from 'dayjs';

import { PrismaService } from '@/internal/services';
import { UserService } from '../user/user.service';
import { ArtistService } from '../artist/artist.service';

import { ArtistRegisterDTO, LoginDTO, UserRegisterDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private user: UserService,
    private artist: ArtistService,
  ) {}

  async createUser(user: UserRegisterDTO & { ipAddress: string }) {
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
        'Something went wrong while trying to create your account, try again.',
      );
    }

    const token = this.getJwt({ user: newUser });

    return {
      token,
      user: { email: user.email },
    };
  }

  async createArtist(artist: ArtistRegisterDTO) {
    let newArtist = {};
    const { isBand, bandName, members, artisticName, ...artistData } = artist;

    const hashedPassword = await hash(artistData.password, 10);

    if (isBand) {
      newArtist = await this.prisma.artist.create({
        data: {
          ...artistData,
          password: hashedPassword,
          verifiedEmail: false,
          band: {
            create: {
              name: bandName,
              members,
            },
          },
        },
      });
    } else {
      newArtist = await this.prisma.artist.create({
        data: {
          ...artistData,
          password: hashedPassword,
          verifiedEmail: false,
          artisticName,
        },
      });
    }

    if (!newArtist) {
      throw new BadRequest(
        'Something went wrong while trying to create your account, try again.',
      );
    }

    const token = this.getJwt({ artist: newArtist });

    return {
      artist: {
        email: artist.email,
      },
      token,
    };
  }

  async login(credentials: LoginDTO) {
    let entity: Artist | User;

    if (credentials.isArtist) {
      entity = await this.artist.getByEmail(credentials.email);
    } else {
      entity = await this.user.getByEmail(credentials.email);
    }

    if (!entity) {
      throw new NotFound('That account does not exist');
    }

    const passwordsMatch = await compare(credentials.password, entity.password);

    if (!passwordsMatch) {
      throw new Unauthorized('Incorrect password');
    }

    const token = this.getJwt({ entity });

    return {
      token,
      entity: {
        email: entity.email,
      },
    };
  }

  getJwt(payload: { user } | { artist } | { entity }) {
    return sign({ payload }, this.config.get('JWT_SECRET'), {
      expiresIn: this.config.get('JWT_EXPIRY_TIME'),
    });
  }
}
