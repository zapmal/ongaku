import {
  UploadedFile,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException as Unauthorized,
  UseInterceptors,
  InternalServerErrorException as InternalServerError,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { sign } from 'jsonwebtoken';
import { Response } from 'express';

import { RoleGuard } from '@/internal/guards';
import { Role } from '@/internal/constants';

import { UserService } from './user.service';
import { UpdateUserDTO } from './user.dto';

import { PlaylistService } from '../playlist/playlist.service';
import { ArtistService } from '../artist/artist.service';

import { RequestWithEntity } from '@/internal/interfaces';
import { cookieOptions, multerImageOptions } from '@/internal/helpers';
import { existsSync, unlink } from 'fs';
import { ConfigService } from '@nestjs/config';

@Controller('user')
@UseGuards(RoleGuard([Role.ADMIN, Role.USER]))
export class UserController {
  constructor(
    private user: UserService,
    private playlist: PlaylistService,
    private artist: ArtistService,
    private config: ConfigService,
  ) {}

  @Get('all')
  async getAll() {
    return await this.user.getAll();
  }

  @Get('profile/:username')
  async getProfileData(
    @Param('username') username: string,
    @Req() request: RequestWithEntity,
  ) {
    const user = await this.user.getByUsername(username);
    const playlists = await this.playlist.getLiked(user.id);
    const followedArtists = await this.artist.getFollowed(
      user.id,
      Number(request.entity.id),
    );

    return { user, playlists, followed: followedArtists };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.user.delete(id);

    return { message: 'Usuario eliminado exitosamente' };
  }

  @Put('edit')
  @UseInterceptors(FileInterceptor('avatar', { ...multerImageOptions }))
  async updateUser(
    @Body() newUserData: UpdateUserDTO,
    @Req() request: RequestWithEntity,
    @UploadedFile()
    newAvatar: Express.Multer.File,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (
      request.entity.role === Role.USER &&
      request.entity.id !== Number(newUserData.id)
    ) {
      throw new Unauthorized('No tienes permiso para realizar esta acción');
    }
    const { avatar: existingAvatar } = await this.user.getById(Number(newUserData.id));
    const path = `${this.config.get('UPLOADED_FILES_DESTINATION')}/user`;

    if (existingAvatar && existsSync(`${path}/${existingAvatar}`) && newAvatar) {
      unlink(`${path}/${existingAvatar}`, (error) => {
        if (error) {
          throw new InternalServerError(
            'Ocurrió un error de nuestro lado mientras actualizabamos tu perfil',
          );
        }
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, avatar, isMetadataEdit, ipAddress, active, verifiedEmail, ...data } =
      newUserData;

    if (isMetadataEdit === 'true') {
      await this.user.updateMetadata(Number(id), {
        ipAddress,
        active: active === 'true',
        verifiedEmail: verifiedEmail === 'true',
      });
    } else {
      await this.user.update(Number(id), data, {
        file: newAvatar,
        path,
      });
    }

    const updatedUserData = await this.user.getById(Number(newUserData.id));
    const user = {
      ...updatedUserData,
      verifiedEmail: updatedUserData.userMetadata.verifiedEmail,
    };

    if (request.entity.id === Number(newUserData.id)) {
      response.clearCookie('token');
      const token = this.getJwt({ ...user });
      response.cookie('token', token, cookieOptions);
    }

    return {
      message: 'Actualizado exitosamente',
      user,
    };
  }

  getJwt(payload: Record<string, unknown>) {
    return sign(payload, this.config.get('JWT_SECRET'), {
      expiresIn: this.config.get('JWT_EXPIRY_TIME'),
    });
  }
}
