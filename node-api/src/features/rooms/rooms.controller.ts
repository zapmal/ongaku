import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { Role } from '@/internal/constants';
import { RoleGuard } from '@/internal/guards';
import { RequestWithEntity } from '@/internal/interfaces';
import { JoiValidationPipe } from '@/internal/pipes';

import { UpdateUserListDTO, NewRoomDTO, UpdateQueueDTO } from './rooms.dto';
import { createNewRoomSchema } from './rooms.schemas';
import { RoomsService } from './rooms.service';

@Controller('rooms')
@UseGuards(RoleGuard([Role.ADMIN, Role.USER, Role.ARTIST]))
export class RoomsController {
  constructor(private rooms: RoomsService) {}

  @Get('all')
  async getAll() {
    return await this.rooms.getAll();
  }

  @Get(':key')
  async getByKey(@Param() { key }) {
    return await this.rooms.getByKey(key);
  }

  @Put(':key/add')
  async addUser(@Body() { userId }: UpdateUserListDTO, @Param() { key }) {
    return await this.rooms.addUser(key, userId);
  }

  @Put(':key/remove')
  async removeUser(@Param() { key }, @Body() { userId }: UpdateUserListDTO) {
    return await this.rooms.removeUser(key, userId);
  }

  @Put(':key/ban')
  async banUser(@Param() { key }, @Body() { userId }: UpdateUserListDTO) {
    return await this.rooms.banUser(key, userId);
  }

  @Put(':key/update-queue')
  async updateQueue(@Param() { key }, @Body() { queue }: UpdateQueueDTO) {
    return await this.rooms.updateQueue(key, queue);
  }

  @Delete(':key')
  async delete(@Param() { key }, @Req() request: RequestWithEntity) {
    const entity = request.entity;

    await this.rooms.delete(key, Number(entity.id), entity.role as Role);
  }

  @Post('new')
  @UsePipes(new JoiValidationPipe(createNewRoomSchema))
  async create(@Body() newRoomData: NewRoomDTO, @Req() request: RequestWithEntity) {
    const room = await this.rooms.create(
      newRoomData,
      Number(request.entity.id),
      this.generateKey(),
    );

    return {
      message: 'Sala creada exitosamente, ¡invita a tus amigos!',
      room,
    };
  }

  generateKey() {
    const LENGTH = 8;
    const CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let code = '';

    for (let index = LENGTH; index > 0; --index) {
      code += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    }

    return code;
  }
}
