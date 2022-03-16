import { PrismaService } from '@/internal/services';
import {
  BadRequestException as BadRequest,
  Injectable,
  NotFoundException as NotFound,
  UnauthorizedException as Unauthorized,
} from '@nestjs/common';
import { NewRoomDTO } from './rooms.dto';

@Injectable()
export class RoomsService {
  private AVAILABLE_ROOMS_LIMIT = 8;
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const rooms = await this.prisma.room.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (rooms.length === 0) {
      throw new NotFound('No hay salas disponibles, ¿porque no creas una?');
    }

    return rooms;
  }

  async delete(key: string, host: number, role: string) {
    const room = await this.prisma.room.findUnique({
      where: { host },
    });

    if (!room) {
      throw new NotFound('La sala no existe');
    }

    if (room?.host === host || role === 'ADMIN') {
      await this.prisma.room.delete({
        where: {
          key,
        },
      });
    } else {
      throw new Unauthorized('No tienes permiso para borrar esta sala');
    }
  }

  async getByKey(key: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        key,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!room) {
      throw new NotFound('La sala no existe');
    }

    const condition = room.users.map((userId) => ({ id: userId }));

    const users = await this.prisma.user.findMany({
      where: {
        OR: condition,
      },
      select: {
        role: true,
        fullName: true,
        avatar: true,
        username: true,
        id: true,
      },
    });

    return {
      ...room,
      usersData: users,
    };
  }

  async addUser(key: string, userId: number) {
    if (!userId || !key) {
      throw new BadRequest('La solicitud está errada, falta información');
    }

    const room = await this.prisma.room.findUnique({ where: { key } });

    if (!room) {
      throw new NotFound('La sala no existe');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFound('El usuario no existe');
    } else if (user.id === room.host) {
      throw new BadRequest('No te puedes agregar a ti mismo');
    }

    const isUserInRoom = room.users.find((id) => id === userId);

    if (isUserInRoom) {
      throw new BadRequest('El usuario ya está en la sala');
    }

    const users = room.users;
    users.push(userId);

    return await this.prisma.room.update({
      where: { key },
      data: {
        users,
      },
    });
  }

  async banUser(key: string, userId: number) {
    if (!userId || !key) {
      throw new BadRequest('La solicitud está errada, falta información');
    }

    const room = await this.prisma.room.findUnique({ where: { key } });

    if (!room) {
      throw new NotFound('La sala no existe');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFound('El usuario no existe');
    } else if (user.id === room.host) {
      throw new BadRequest('No te puedes banear a ti mismo');
    }

    const isUserInRoom = room.users.find((id) => id === userId);

    if (!isUserInRoom) {
      throw new BadRequest('El usuario no está en la sala');
    }

    const users = room.users.filter((id) => id !== userId);
    const banList = room.banList;

    if (banList.includes(userId)) {
      throw new BadRequest('El usuario ya está baneado');
    }
    banList.push(userId);

    return await this.prisma.room.update({
      where: { key },
      data: {
        users,
        banList,
      },
    });
  }

  async removeUser(key: string, userId: number) {
    if (!userId || !key) {
      throw new BadRequest('La solicitud está errada, falta información');
    }

    const room = await this.prisma.room.findUnique({ where: { key } });

    if (!room) {
      throw new NotFound('La sala no existe');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFound('El usuario no existe');
    } else if (user.id === room.host) {
      throw new BadRequest('No te puedes eliminar a ti mismo');
    }

    const isUserInRoom = room.users.find((id) => id === userId);

    if (!isUserInRoom) {
      throw new BadRequest('El usuario no está en la sala');
    }

    const users = room.users.filter((id) => id !== userId);

    return await this.prisma.room.update({
      where: { key },
      data: {
        users,
      },
    });
  }

  async updateQueue(key: string, queue: Array<any>) {
    const room = await this.prisma.room.findUnique({ where: { key } });

    if (!room) {
      throw new NotFound('La sala no existe');
    }

    return await this.prisma.room.update({
      where: { key },
      data: {
        queue,
      },
    });
  }

  async create(data: NewRoomDTO, userId: number, key: string) {
    const user = await this.prisma.room.findUnique({
      where: {
        host: userId,
      },
    });

    if (user) {
      throw new BadRequest('Ya creaste una sala, no puedes hostear dos al mismo tiempo');
    }

    const rooms = await this.prisma.room.findMany({});

    if (rooms.length >= this.AVAILABLE_ROOMS_LIMIT) {
      throw new BadRequest(
        'No puedes crear una sala en estos momentos, unete o espera a que una cierre',
      );
    }

    return await this.prisma.room.create({
      data: {
        key,
        host: userId,
        ...data,
      },
    });
  }
}
