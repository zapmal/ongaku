import React from 'react';

import { lazyImport } from '@/utils/lazyImport';

const { PublicRoutes } = lazyImport(() => import('./PublicRoutes'), 'PublicRoutes');
const { ProtectedRoutes } = lazyImport(() => import('./ProtectedRoutes'), 'ProtectedRoutes');

export function AppRoutes() {
  const isLoggedIn = true;
  return isLoggedIn ? <PublicRoutes /> : <ProtectedRoutes />;
}
