import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { User, Artist } from '@prisma/client';
import { Observable } from 'rxjs';
import { Request } from 'express';

import { ArtistService } from '@/features/artist/artist.service';
import { UserService } from '@/features/user/user.service';

@Injectable()
export class DuplicateEntityGuard implements CanActivate {
  constructor(private artist: ArtistService, private user: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.checkDuplicate(request);
  }

  async checkDuplicate(request: Request) {
    let emailIsDuplicated: User | Artist;

    if (request.body.role === 'USER') {
      const usernameIsDuplicated = await this.user.getByUsername(request.body.username);

      if (usernameIsDuplicated) {
        throw new HttpException(
          'The supplied username is already being used, please try again with a new one',
          HttpStatus.CONFLICT,
        );
      }

      emailIsDuplicated = await this.user.getByEmail(request.body.email);
    } else {
      emailIsDuplicated = await this.artist.getByEmail(request.body.email);
    }

    if (emailIsDuplicated) {
      throw new HttpException(
        'The supplied email is already being used, please try again with a new one',
        HttpStatus.CONFLICT,
      );
    }

    return true;
  }
}
