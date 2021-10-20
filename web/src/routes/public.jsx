import React from 'react';

import { lazyImport } from '@/utils/lazyImport';

const { Register } = lazyImport(() => import('@/features/auth'), 'Register');
const { NotFound } = lazyImport(() => import('@/features/misc'), 'NotFound');
const { Landing } = lazyImport(() => import('@/features/misc'), 'Landing');

export const publicRoutes = [
  {
    path: '/register',
    element: <Register />,
  },
];

export const sharedRoutes = [
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
