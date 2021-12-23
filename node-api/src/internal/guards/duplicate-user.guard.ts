import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

import { UserService } from '@/features/user/user.service';

@Injectable()
export class DuplicateUserGuard implements CanActivate {
  constructor(private userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.checkDuplicate(request);
  }

  async checkDuplicate(request: Request) {
    const isDuplicated = await this.userService.getUserByEmail(request.body.email);

    if (isDuplicated && isDuplicated.id) {
      throw new HttpException(
        'The supplied email is already being used, please try again with a new one.',
        HttpStatus.CONFLICT,
      );
    }

    return true;
  }
}
