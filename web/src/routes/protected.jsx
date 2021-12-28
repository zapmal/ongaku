import React from 'react';

import { lazyImport } from '@/utils/lazyImport';

const { Welcome } = lazyImport(() => import('@/features/misc'), 'Welcome');
const { VerifyEmail } = lazyImport(() => import('@/features/auth'), 'VerifyEmail');

export const protectedRoutes = [
  {
    path: '/welcome',
    element: <Welcome />,
  },
  {
    path: '/verify/:hash',
    element: <VerifyEmail />,
  },
];
