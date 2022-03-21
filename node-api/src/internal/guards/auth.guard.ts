import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException as Forbidden,
  InternalServerErrorException as InternalServerError,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Artist, User } from '.prisma/client';

import { RequestWithEntity } from '@/internal/interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.validate(request);
  }

  validate(request: RequestWithEntity) {
    const token = request.cookies['token'];
    const SECRET = this.config.get('JWT_SECRET');

    if (!token) {
      throw new Forbidden('You do not have permission to make this action');
    }

    const entity = verify(token, SECRET) as JwtPayload & (User | Artist);

    if (!entity) {
      throw new InternalServerError('We could not process your request, try again later');
    }

    request.entity = {
      id: entity.id,
      email: entity.email,
      username: entity.username,
      verifiedEmail: entity.verifiedEmail,
      avatar: entity.avatar,
      artisticName: entity.artisticName,
      role: entity.role,
    };

    return true;
  }
}
