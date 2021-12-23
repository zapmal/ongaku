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
  constructor(private artistService: ArtistService, private userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.checkDuplicate(request);
  }

  async checkDuplicate(request: Request) {
    let isDuplicated: User | Artist;

    if (request.body.role === 'USER') {
      isDuplicated = await this.userService.getUserByEmail(request.body.email);
    } else {
      isDuplicated = await this.artistService.getArtistByEmail(request.body.email);
    }

    if (isDuplicated && isDuplicated.id) {
      throw new HttpException(
        'The supplied email is already being used, please try again with a new one.',
        HttpStatus.CONFLICT,
      );
    }

    return true;
  }
}
