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
} from '@nestjs/common';

import { UserService } from './user.service';
import { UpdateUserDTO } from './user.dto';
import { updateUserSchema } from './user.schemas';

import { JoiValidationPipe } from 'src/utils/joi.pipe';
import { AuthGuard } from 'src/utils/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    const users = await this.userService.getAllUsers();

    if (!users) {
      throw new NotFound('There are no users in the system.');
    }

    return users;
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUser(id);

    if (!user) {
      throw new NotFound('Requested user was not found.');
    }

    return user;
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const userExists = await this.userService.getUser(id);

    if (!userExists) {
      throw new NotFound('Requested user was not found.');
    }

    await this.userService.deleteUser(id);

    return { message: 'User successfully erased from the system.' };
  }

  @Put(':id')
  @UsePipes(new JoiValidationPipe(updateUserSchema))
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() newUserData: UpdateUserDTO,
  ) {
    const userExists = await this.userService.getUser(id);

    if (!userExists) {
      throw new NotFound('Requested user was not found.');
    }

    await this.userService.updateUser(id, newUserData);

    return { message: 'User updated successfully.' };
  }
}
