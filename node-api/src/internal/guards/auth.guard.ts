import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.validate(request);
  }

  validate(request: Request & { user: Record<string, unknown> }) {
    const token = request.cookies['token'];
    const SECRET = this.configService.get('JWT_SECRET');

    if (!token) {
      throw new HttpException(
        'You do not have permission to make this action',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = verify(token, SECRET) as Record<string, unknown>;

    if (!user) {
      throw new HttpException(
        'We could not process your request, try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    request.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };

    return true;
  }
}
