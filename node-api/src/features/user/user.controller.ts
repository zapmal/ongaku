import {
  NotFoundException as NotFound,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UsePipes,
  Put,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { JoiValidationPipe } from '@/internal/pipes';
import { RoleGuard } from '@/internal/guards';
import { Role } from '@/internal/constants';

import { UserService } from './user.service';
import { GetProfileDataDTO, UpdateUserDTO } from './user.dto';
import { getProfileDataSchema, updateUserSchema } from './user.schemas';

import { PlaylistService } from '../playlist/playlist.service';
import { ArtistService } from '../artist/artist.service';

@Controller('user')
@UseGuards(RoleGuard([Role.ADMIN, Role.USER]))
export class UserController {
  constructor(
    private user: UserService,
    private playlist: PlaylistService,
    private artist: ArtistService,
  ) {}

  @Get('all')
  async getAllUsers() {
    const users = await this.user.getAll();

    if (!users) {
      throw new NotFound('There are no users in the system.');
    }

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

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new JoiValidationPipe(updateUserSchema))
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() newUserData: UpdateUserDTO,
  ) {
    const userExists = await this.user.getById(id);

    if (!userExists) {
      throw new NotFound('Requested user was not found.');
    }

    await this.user.update(id, newUserData);

    return { message: 'User updated successfully.' };
  }
}
