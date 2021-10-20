import React from 'react';
import { useRoutes } from 'react-router-dom';

import { protectedRoutes } from './protected';
import { publicRoutes, sharedRoutes } from './public';

export function AppRoutes() {
  // const isLoggedIn = useAuth(); gives access to .user, etc.
  const isLoggedIn = true;
  const routes = isLoggedIn ? protectedRoutes : publicRoutes;

  const element = useRoutes([...sharedRoutes, ...routes]);

  return <>{element}</>;
}
