import React from 'react';

import { useAuth } from './auth';

export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  MANAGER: 'MANAGER',
  ARTIST: 'ARTIST',
};

export const POLICIES = {
  // Example
  'song:delete': (user, song) => {
    if (user.role === 'ADMIN') {
      return true;
    }

    if (user.role === 'ARTIST' && song.authorId === user.id) {
      return true;
    }

    return false;
  },
};

export const useAuthorization = () => {
  const { user } = useAuth();

  if (!user) {
    throw Error('User does not exist!');
  }

  const checkAccess = React.useCallback(
    ({ allowedRoles }) => {
      if (allowedRoles && allowedRoles.length > 0) {
        return allowedRoles?.includes(user.role);
      }

      return true;
    },
    [user.role]
  );

  return { checkAccess, role: user.role };
};

export const Authorization = ({
  policyCheck,
  allowedRoles,
  forbiddenFallback = null,
  children,
}) => {
  const { checkAccess } = useAuthorization();

  let canAccess = false;

  if (allowedRoles) {
    canAccess = checkAccess({ allowedRoles });
  }

  if (typeof policyCheck !== 'undefined') {
    canAccess = policyCheck;
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};
