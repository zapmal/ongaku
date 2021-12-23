import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

import { ArtistService } from '@/features/artist/artist.service';

@Injectable()
export class DuplicateArtistGuard implements CanActivate {
  constructor(private artistService: ArtistService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.checkDuplicate(request);
  }

  async checkDuplicate(request: Request) {
    const isDuplicated = await this.artistService.getArtistByEmail(request.body.email);

    if (isDuplicated && isDuplicated.id) {
      throw new HttpException(
        'The supplied email is already being used, please try again with a new one.',
        HttpStatus.CONFLICT,
      );
    }

    return true;
  }
}
