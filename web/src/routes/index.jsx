import React from 'react';
import { useRoutes } from 'react-router-dom';

import { protectedRoutes } from './protected';
import { publicRoutes, sharedRoutes } from './public';

import { Spinner } from '@/components/Utils';
import { useAuthStore } from '@/stores/useAuthStore';

export function AppRoutes() {
  const [isLoggedIn, logout] = useAuthStore((s) => [s.isLoggedIn, s.logout]);
  /**
   * On initial render, the value of isLoggedIn that comes from the
   * store is false, which in turn renders the "Not Found" page for a brief
   * moment. To fix it, on every log-in we store a "isLoggedIn" on the browser,
   * that way here we can check if the user is already logged in, if they are
   * then we make then wait a bit with the spinner to not show the flash of unauthenticated
   * content.
   */
  let shouldWait = false;
  let timeoutId = 0;
  const localIsLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));

  if (localIsLoggedIn && !isLoggedIn()) {
    shouldWait = true;

    timeoutId = setTimeout(() => {
      logout();
      window.location.assign('/');
    }, 10000);
  }

  const routes = isLoggedIn() ? protectedRoutes : publicRoutes;
  const element = useRoutes([...sharedRoutes, ...routes]);

  if (!shouldWait) clearTimeout(timeoutId);

  return shouldWait ? <Spinner /> : element;
}
