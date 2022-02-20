import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';

import { Role } from '../constants';
import { RequestWithEntity } from '../interfaces';

import { AuthGuard } from './auth.guard';

export const RoleGuard = (allowedRoles: Role[]): Type<CanActivate> => {
  class RoleGuardMixin extends AuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context); // Basically using @AuthGuard

      const request = context.switchToHttp().getRequest<RequestWithEntity>();
      const entity = request.entity;

      return allowedRoles.some((role) => role === entity?.role);
    }
  }

  return mixin(RoleGuardMixin);
};
