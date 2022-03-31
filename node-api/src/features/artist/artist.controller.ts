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
  UnauthorizedException as Unauthorized,
  UploadedFiles,
  UseInterceptors,
  Delete,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
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

  @Get('all')
  async getAll() {
    return await this.artist.getAll();
  }

  @Get('/songs/:id')
  async getSongsById(@Param() { id }) {
    return await this.artist.getSongs(Number(id));
  }

  @Get('/albums/:id')
  async getAlbumsById(@Param() { id }) {
    return await this.artist.getAlbums(Number(id));
  }

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
        isFollowed: artist.interaction[0].value,
      };
    });
  }

  @Get('profile/:name')
  async getProfileData(@Param('name') name: string, @Req() request: RequestWithEntity) {
    const artist = await this.artist.getByName(name);
    const recommendation = await this.artist.getByGenre(
      artist.id,
      artist.genres,
      Number(request.entity.id),
    );
    const latestSongs = await this.artist.getLatestSongs(
      artist.id,
      Number(request.entity.id),
    );
    const albums = await this.artist.getAlbums(artist.id);

    return {
      artist,
      latestSongs,
      recommendation,
      albums,
    };
  }

  @Get('latest')
  async newArtists(@Req() request: RequestWithEntity) {
    return await this.artist.getLatest(Number(request.entity.id));
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
      request.entity.id !== Number(newArtistData.id) &&
      request.entity.role === Role.ARTIST
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
    const { id, avatar, cover, members, labels, yearsActive, isAdminEdit, ...data } =
      newArtistData;
    let updated = {};

    if (isAdminEdit === 'true') {
      let bandData = {};
      if (members) {
        bandData = {
          artisticName: '',
          band: {
            update: {
              members: members.split(','),
              name: data.artisticName,
            },
          },
        };
      }

      updated = await this.artist.update(Number(id), {
        ...data,
        ...bandData,
        labels: labels.split(','),
        yearsActive: Number(yearsActive),
      });
    } else {
      updated = await this.artist.updateInformation(
        Number(newArtistData.id),
        data,
        uploadedImages,
        path,
      );
    }

    return { message: 'Actualizado exitosamente', updated };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.artist.delete(id);

    return { message: 'Artista eliminado exitosamente' };
  }
}
