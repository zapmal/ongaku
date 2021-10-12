import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.validate(request);
  }

  validate(request: Request & { user: Record<string, unknown> }) {
    const token = request.cookies['token'];
    const SECRET = process.env.JWT_SECRET;

    if (!token) return false;

    const user = verify(token, SECRET) as Record<string, unknown>;

    if (!user) return false;

    request.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };

    return true;
  }
}
