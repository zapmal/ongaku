import { Artist, User } from '@prisma/client';

import { UserRegisterDTO } from './auth.dto';

export interface UserRegisterAndMetadata extends UserRegisterDTO {
  ipAddress: string;
}

export interface UserWithVerifiedEmail extends User {
  verifiedEmail: boolean;
}

export type Entity = Artist | UserWithVerifiedEmail;
