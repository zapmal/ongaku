import React from 'react';

import { lazyImport } from '@/utils/lazyImport';

const { Welcome } = lazyImport(() => import('@/features/misc'), 'Welcome');

export const protectedRoutes = [
  {
    path: '/welcome',
    element: <Welcome />,
  },
];
