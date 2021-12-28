import { Box, Spinner } from '@chakra-ui/react';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { UserWelcome } from './UserWelcome';

import { ResendVerificationEmail } from '@/features/auth';
import { useAuthStore } from '@/stores/useAuthStore';

export function Welcome() {
  const location = useLocation();
  const entity = useAuthStore((s) => s.entity);
  let pageToRender = null;

  if (location.search.includes('user')) {
    pageToRender = <UserWelcome />;
  } else if (location.search.includes('artist')) {
    pageToRender = <h1>Artist Welcome</h1>;
  } else {
    pageToRender = <Navigate to="/" />;
  }

  return (
    <div>
      {!entity.verifiedEmail && <ResendVerificationEmail isOpen={true} />}
      <React.Suspense fallback={<LoadingFallback />}>{pageToRender}</React.Suspense>
    </div>
  );
}

function LoadingFallback() {
  return (
    <Box textAlign="center" paddingTop="200px">
      <Spinner size="xl" />
    </Box>
  );
}
