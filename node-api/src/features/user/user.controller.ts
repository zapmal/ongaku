import {
  NotFoundException as NotFound,
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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { RoleGuard } from '@/internal/guards';
import { Role } from '@/internal/constants';

import { UserService } from './user.service';
import { UpdateUserDTO } from './user.dto';

import { PlaylistService } from '../playlist/playlist.service';
import { ArtistService } from '../artist/artist.service';

import { RequestWithEntity } from '@/internal/interfaces';
import { multerImageOptions } from '@/internal/helpers';
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
    const users = await this.user.getAll();

    if (!users) throw new NotFound('No hay usuarios registrados en el sistema');

    return users;
  }

  @Get('profile/:username')
  async getProfileData(@Param('username') username: string) {
    const user = await this.user.getByUsername(username);
    const playlists = await this.playlist.getLiked(user.id);
    const followedArtists = await this.artist.getFollowed(user.id);

    return { user, playlists, followed: followedArtists };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const userExists = await this.user.getById(id);

    if (!userExists) {
      throw new NotFound('Requested user was not found.');
    }

    await this.user.delete(id);

    return { message: 'User successfully erased from the system.' };
  }

  @Put('edit')
  @UseInterceptors(FileInterceptor('avatar', { ...multerImageOptions }))
  async updateUser(
    @Body() newUserData: UpdateUserDTO,
    @Req() request: RequestWithEntity,
    @UploadedFile()
    newAvatar: Express.Multer.File,
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
    const { id, avatar, isAdminEdit, ipAddress, active, verifiedEmail, ...data } =
      newUserData;

    if (isAdminEdit === 'true') {
      console.log({ id, aaa: eval(active), verifiedEmail });
      const a = await this.user.updateMetadata(Number(id), {
        ipAddress,
        active: active === 'true',
        verifiedEmail: verifiedEmail === 'true',
      });

      console.log(a);
    } else {
      await this.user.update(Number(id), data, {
        file: newAvatar,
        path,
      });
    }

    return { message: 'Actualizado exitosamente' };
  }
}
