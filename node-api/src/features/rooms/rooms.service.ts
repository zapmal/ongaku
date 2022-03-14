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
  private AVAILABLE_ROOMS_LIMIT = 10;
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
      throw new NotFound('No hay salas disponibles');
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

  async create(data: NewRoomDTO, userId: number, key: string) {
    const user = await this.prisma.room.findUnique({
      where: {
        host: userId,
      },
    });

    if (user) {
      throw new BadRequest('Ya creaste una sala, no puedes hostear dos al mismo tiempo');
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
