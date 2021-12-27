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
import { AuthGuard } from '@/internal/guards';

import { UserService } from './user.service';
import { UpdateUserDTO } from './user.dto';
import { updateUserSchema } from './user.schemas';

@Controller('user')
export class UserController {
  constructor(private readonly user: UserService) {}

  @Get('all')
  async getAllUsers() {
    const users = await this.user.getAll();

    if (!users) {
      throw new NotFound('There are no users in the system.');
    }

    return users;
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.user.getById(id);

    if (!user) {
      throw new NotFound('Requested user was not found.');
    }

    return user;
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
