import { Box, Spinner } from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router-dom';

import { useAuthStore } from '@/stores/useAuthStore';
import { lazyImport } from '@/utils/lazyImport';

const { Welcome } = lazyImport(() => import('@/features/misc'), 'Welcome');
const { VerifyEmail } = lazyImport(() => import('@/features/auth'), 'VerifyEmail');
const { ResendVerificationEmail } = lazyImport(
  () => import('@/features/auth'),
  'ResendVerificationEmail'
);

function Wrapper() {
  const entity = useAuthStore((s) => s.entity);
  return (
    <>
      <React.Suspense fallback={<LoadingFallback />}>
        {!entity.verifiedEmail && <ResendVerificationEmail />}
        <Outlet />
      </React.Suspense>
    </>
  );
}

export const protectedRoutes = [
  {
    element: <Wrapper />,
    children: [
      {
        path: '/welcome',
        element: <Welcome />,
      },
      {
        path: '/hehe',
        element: <h1>hellO!!!</h1>,
      },
    ],
  },
  {
    path: '/verify/:hash',
    element: <VerifyEmail />,
  },
];

function LoadingFallback() {
  return (
    <Box textAlign="center" paddingTop="200px" overflow="hidden">
      <Spinner size="xl" />
    </Box>
  );
}
