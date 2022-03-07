import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
  UsePipes,
  InternalServerErrorException as InternalServerError,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { Role } from '@/internal/constants';
import { RoleGuard } from '@/internal/guards';
import { RequestWithEntity } from '@/internal/interfaces';
import { JoiValidationPipe } from '@/internal/pipes';
import { multerImageOptions } from '@/internal/helpers';

import { ArtistService } from './artist.service';
import { FollowArtistDTO, UpdateArtistDTO } from './artist.dto';
import { followArtistSchema } from './artist.schemas';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { existsSync, unlink } from 'fs';

@Controller('artist')
@UseGuards(RoleGuard([Role.ADMIN, Role.USER, Role.ARTIST]))
export class ArtistController {
  constructor(private artist: ArtistService, private config: ConfigService) {}

  @Get('followed')
  async getFollowed(@Req() request: RequestWithEntity) {
    const followedArtists = await this.artist.getFollowed(Number(request.entity.id));

    return followedArtists.map(({ artist }) => {
      return {
        id: artist.id,
        artisticName: artist.artisticName,
        bandName: artist.band ? artist.band.name : null,
        avatar: artist.avatar,
        followers: artist.artistMetrics.followers,
      };
    });
  }

  @Get('profile/:name')
  async getProfileData(@Param('name') name: string) {
    const artist = await this.artist.getByName(name);
    const recommendation = await this.artist.getByGenre(artist.id, 'pop');
    const popularSongs = await this.artist.getPopularSongs(artist.id);
    const albums = await this.artist.getAlbums(artist.id);

    return {
      artist,
      popularSongs,
      recommendation,
      albums,
    };
  }

  @Put('follow')
  @UsePipes(new JoiValidationPipe(followArtistSchema))
  async follow(@Req() request: RequestWithEntity, @Body() { artistId }: FollowArtistDTO) {
    const followedArtist = await this.artist.follow(artistId, Number(request.entity.id));

    return {
      message: followedArtist
        ? 'Artista agregado a tu lista de seguidos'
        : 'Artista removido de tu lista de seguidos',
    };
  }

  @Put('edit')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'cover',
          maxCount: 1,
        },
        {
          name: 'avatar',
          maxCount: 1,
        },
      ],
      { ...multerImageOptions },
    ),
  )
  async updateArtist(
    @Body() newArtistData: UpdateArtistDTO,
    @Req() request: RequestWithEntity,
    @UploadedFiles()
    uploadedImages: Array<Express.Multer.File>,
  ) {
    if (
      request.entity.id !== Number(newArtistData.id) ||
      request.entity.role !== Role.ADMIN
    ) {
      throw new Unauthorized('No tienes permiso para realizar esta acción');
    }
    const images = await this.artist.getImagesById(Number(newArtistData.id));
    const path = `${this.config.get('UPLOADED_FILES_DESTINATION')}/artist`;

    if (
      images.avatar &&
      existsSync(`${path}/${images.avatar}`) &&
      uploadedImages['avatar']
    ) {
      unlink(`${path}/${images.avatar}`, (error) => {
        if (error) {
          throw new InternalServerError(
            'Ocurrió un error de nuestro lado mientras actualizabamos tu avatar',
          );
        }
      });
    }

    if (
      images.artistInformation?.coverImage &&
      existsSync(`${path}/${images.artistInformation?.coverImage}`) &&
      uploadedImages['cover']
    ) {
      unlink(`${path}/${images.artistInformation?.coverImage}`, (error) => {
        if (error) {
          throw new InternalServerError(
            'Ocurrió un error de nuestro lado mientras actualizabamos tu portada',
          );
        }
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, avatar, cover, ...data } = newArtistData;
    const updated = await this.artist.updateInformation(
      Number(newArtistData.id),
      data,
      uploadedImages,
      path,
    );

    return { message: 'Actualizado exitosamente', updated };
  }
}
