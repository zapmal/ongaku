import React from 'react';
import { useRoutes } from 'react-router-dom';

import { protectedRoutes } from './protected';
import { publicRoutes, sharedRoutes } from './public';

import { useAuthStore } from '@/stores/useAuthStore';

export function AppRoutes() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const routes = isLoggedIn() ? protectedRoutes : publicRoutes;

  const element = useRoutes([...sharedRoutes, ...routes]);

  return <>{element}</>;
}
