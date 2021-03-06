import React from 'react';
import { Outlet } from 'react-router-dom';

import { Layout } from '@/components/Core';
import { useAuthStore } from '@/stores/useAuthStore';
import { lazyImport } from '@/utils/lazyImport';

const { VerifyEmail } = lazyImport(() => import('@/features/auth'), 'VerifyEmail');
const { ResendVerificationEmail } = lazyImport(
  () => import('@/features/auth'),
  'ResendVerificationEmail'
);
const { Home } = lazyImport(() => import('@/features/app'), 'Home');
const { Queue } = lazyImport(() => import('@/features/app'), 'Queue');
const { Library } = lazyImport(() => import('@/features/app'), 'Library');
const { Explore } = lazyImport(() => import('@/features/app'), 'Explore');
const { Search } = lazyImport(() => import('@/features/app'), 'Search');
const { Rooms } = lazyImport(() => import('@/features/app'), 'Rooms');
const { Room } = lazyImport(() => import('@/features/app'), 'Room');
const { View } = lazyImport(() => import('@/features/app'), 'View');

const { UserProfile } = lazyImport(() => import('@/features/profiles'), 'UserProfile');
const { ArtistProfile } = lazyImport(() => import('@/features/profiles'), 'ArtistProfile');

const { Entities } = lazyImport(() => import('@/features/administration'), 'Entities');
const { PublishedWork } = lazyImport(() => import('@/features/administration'), 'PublishedWork');

export const protectedRoutes = [
  {
    element: <VerifiedEmailWrapper />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/home',
            element: <Home />,
          },
          {
            path: '/queue',
            element: <Queue />,
          },
          {
            path: '/library',
            element: <Library />,
          },
          {
            path: '/explore',
            element: <Explore />,
          },
          {
            path: '/search',
            element: <Search />,
          },
          {
            path: '/user/:username',
            element: <UserProfile />,
          },
          {
            path: '/artist/:name',
            element: <ArtistProfile />,
          },
          {
            path: '/view',
            element: <View />,
          },
          {
            path: '/administration/entities',
            element: <Entities />,
          },
          {
            path: '/administration/published-work',
            element: <PublishedWork />,
          },
          {
            path: '/rooms',
            element: <Rooms />,
          },
          {
            path: '/room/:key',
            element: <Room />,
          },
        ],
      },
    ],
  },
  {
    path: '/verify/:hash',
    element: <VerifyEmail />,
  },
];

function VerifiedEmailWrapper() {
  const entity = useAuthStore((s) => s.entity);

  return (
    <>
      {!entity.verifiedEmail && <ResendVerificationEmail />}
      <Outlet />
    </>
  );
}
