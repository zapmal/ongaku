import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Request } from 'express';
import { Artist, User } from '.prisma/client';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.validate(request);
  }

  validate(request: Request & { entity: Record<string, unknown> }) {
    const token = request.cookies['token'];
    const SECRET = this.config.get('JWT_SECRET');

    if (!token) {
      throw new HttpException(
        'You do not have permission to make this action',
        HttpStatus.FORBIDDEN,
      );
    }

    const entity = verify(token, SECRET) as JwtPayload & (User | Artist);

    if (!entity) {
      throw new HttpException(
        'We could not process your request, try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    request.entity = {
      id: entity.id,
      email: entity.email,
      verifiedEmail: entity.verifiedEmail,
      role: entity.role,
    };

    return true;
  }
}
