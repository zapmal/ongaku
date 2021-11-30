import React from 'react';

import { lazyImport } from '@/utils/lazyImport';

const { NotFound } = lazyImport(() => import('@/features/misc'), 'NotFound');
const { Landing } = lazyImport(() => import('@/features/misc'), 'Landing');
const { UserRegister } = lazyImport(() => import('@/features/auth'), 'UserRegister');
const { ArtistRegister } = lazyImport(() => import('@/features/auth'), 'ArtistRegister');
const { ChooseUserType } = lazyImport(() => import('@/features/auth'), 'ChooseUserType');

export const publicRoutes = [
  {
    path: '/register',
    element: <ChooseUserType />,
  },
  {
    path: '/register/user',
    element: <UserRegister />,
  },
  {
    path: '/register/artist',
    element: <ArtistRegister />,
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
