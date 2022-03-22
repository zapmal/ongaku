import {
  BadRequestException as BadRequest,
  InternalServerErrorException as InternalServerError,
  NotFoundException as NotFound,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, Artist, Band, UserMetadata } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import * as dayjs from 'dayjs';

import { UserService } from '../user/user.service';
import { ArtistService } from '../artist/artist.service';
import { ArtistRegisterDTO, LoginDTO, VerifyEmailDTO } from './auth.dto';
import { Entity, UserRegisterAndMetadata, UserWithVerifiedEmail } from './auth.interface';

import { PrismaService } from '@/internal/services';
import { getHash } from '@/internal/helpers';
import { Conflict } from '@/internal/exceptions';
import { PrismaError } from '@/internal/constants';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private user: UserService,
    private artist: ArtistService,
  ) {}

  async createUser(user: UserRegisterAndMetadata) {
    const { ipAddress, password, birthdate, ...userData } = user;
    const hashedPassword = await hash(password, 10);

    try {
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

      return {
        user: {
          email: newUser.email,
          username: newUser.username,
          verifiedEmail: false,
          role: 'USER',
        },
      };
    } catch (error) {
      this.handleAccountCreationError(error);
    }
  }

  async createArtist(artist: ArtistRegisterDTO) {
    let newArtist: Artist | Band;
    const { isBand, bandName, members, artisticName, ...artistData } = artist;

    const hashedPassword = await hash(artistData.password, 10);

    try {
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
            artistMetrics: {
              create: {
                followers: 0,
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
            artistMetrics: {
              create: {
                followers: 0,
              },
            },
          },
        });
      }

      return {
        artist: {
          email: newArtist.email,
          artisticName: newArtist.artisticName,
          verifiedEmail: false,
          role: 'ARTIST',
        },
      };
    } catch (error) {
      this.handleAccountCreationError(error);
    }
  }

  private handleAccountCreationError(error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PrismaError.UniqueConstraint
    ) {
      let target = error?.meta['target'][0];

      if (target === 'artistic_name') {
        target = target.split('_').join(' ');
      }

      throw new Conflict(`The supplied ${target} is already being used`);
    } else {
      throw new InternalServerError(
        'Something went wrong while trying to create your account, try again later',
      );
    }
  }

  async login(credentials: LoginDTO) {
    const entity: Entity = await this.getEntity(credentials.email, credentials.isArtist);

    if (!entity) {
      throw new BadRequest('Una o ambas credenciales son incorrectas');
    }

    const passwordsMatch = await compare(credentials.password, entity.password);

    if (!passwordsMatch) {
      throw new BadRequest('Una o ambas credenciales son incorrectas');
    }

    const verifiedEmail = credentials.isArtist
      ? entity.verifiedEmail
      : entity['userMetadata']
      ? entity['userMetadata'].verifiedEmail
      : false;

    return {
      entity: {
        id: entity.id,
        email: entity.email,
        role: entity.role,
        username: entity['username'],
        verifiedEmail,
        avatar: entity.avatar,
        artisticName: credentials.isArtist
          ? entity['artisticName']
            ? entity['artisticName']
            : entity['band'].name
          : '',
      },
    };
  }

  async getHomeData(entityId: number) {
    const ARTIST_OF_THE_MONTH = 'gidle';
    const PERFECT_FOR_YOU = 'demondice';

    const artistOfTheMonth = await this.prisma.artist.findFirst({
      where: {
        band: {
          name: ARTIST_OF_THE_MONTH,
        },
      },
      include: {
        band: true,
        artistMetrics: true,
        artistInformation: true,
        album: {
          include: {
            interaction: {
              where: {
                userId: entityId,
                songId: undefined,
                userPlaylistId: undefined,
                artistId: undefined,
              },
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
      },
    });

    if (!artistOfTheMonth) {
      throw new NotFound('No encontramos al artista del mes');
    }

    const suggestedArtists = await this.prisma.artist.findMany({
      orderBy: {
        artisticName: 'desc',
      },
      include: {
        artistMetrics: true,
        band: true,
      },
      take: 4,
    });

    if (!suggestedArtists) {
      throw new NotFound('No encontramos artistas sugeridos para ti');
    }

    const perfectForYou = await this.prisma.artist.findFirst({
      where: {
        artisticName: PERFECT_FOR_YOU,
      },
      include: {
        artistMetrics: true,
        artistInformation: true,
      },
    });

    if (!perfectForYou) {
      throw new NotFound('No encontramos al artista perfecto para ti');
    }

    const trendingArtist = await this.prisma.artist.findMany({
      orderBy: {
        artisticName: 'asc',
      },
      include: {
        band: true,
        artistMetrics: true,
        interaction: {
          where: {
            userId: entityId,
            songId: undefined,
            userPlaylistId: undefined,
            albumId: undefined,
          },
          select: {
            id: true,
            value: true,
          },
        },
      },
      take: 2,
    });

    const trendingAlbums = await this.prisma.album.findMany({
      include: {
        artist: {
          include: {
            band: true,
          },
        },
        interaction: {
          where: {
            userId: entityId,
            songId: undefined,
            userPlaylistId: undefined,
            artistId: undefined,
          },
          select: {
            id: true,
            value: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
      take: 3,
    });

    return {
      artistOfTheMonth,
      suggestedArtists,
      perfectForYou,
      trending: {
        artists: [...trendingArtist],
        albums: [...trendingAlbums],
      },
    };
  }

  async verifyEmail(data: VerifyEmailDTO) {
    let entity: Artist | UserMetadata;

    if (data.hash === getHash(data.email)) {
      if (data.role === 'USER') {
        entity = await this.user.updateMetadata(data.id, { verifiedEmail: true });
      } else if (data.role === 'ARTIST') {
        entity = await this.artist.update(data.id, { verifiedEmail: true });
      }
    } else {
      throw new BadRequest(
        'The link does not correspond the account, please request a new one and try again',
      );
    }

    if (!entity) {
      throw new InternalServerError(
        'Something went wrong while trying to verify your account, try again',
      );
    }

    return {
      isEmailVerified: entity.verifiedEmail,
    };
  }

  async getRecoveryCode(email: string, isArtist: boolean) {
    const entity: Entity = await this.getEntity(email, isArtist);

    if (!entity) {
      throw new NotFound('This email is not associated to an Ongaku account');
    }

    const code = Math.floor(Math.random() * 899999 + 100000);

    return { code, entityId: entity.id };
  }

  async changePassword(newPassword: string, entityID: number, isArtist: boolean) {
    const hashedPassword = await hash(newPassword, 10);

    if (isArtist) {
      await this.artist.update(entityID, { password: hashedPassword });
    } else {
      await this.user.update(entityID, { password: hashedPassword });
    }
  }

  async getEntity(email, isArtist) {
    let entity: Entity;

    if (isArtist) {
      entity = await this.artist.getByEmail(email);
    } else {
      entity = (await this.user.getByEmail(email)) as UserWithVerifiedEmail;
    }

    return entity;
  }
}
