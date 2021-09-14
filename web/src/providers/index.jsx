import { Button, Spinner, ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router } from 'react-router-dom';

import { Notifications } from '@/components/Notifications';
import { queryClient } from '@/lib/react-query';
import { AuthProvider } from '@/providers/auth';

/**
 * Button needs to be custom (not Chakra) and
 * divs, h2, etcs. need to be styled.
 */
const ErrorFallback = () => {
  return (
    <div role="alert">
      <h2>Ooops, something went wrong :( </h2>
      {/* This needs to be a custom (stitches) button. */}
      <Button onClick={() => window.location.assign(window.location.origin)}>Refresh</Button>
    </div>
  );
};

export const AppProvider = ({ children }) => {
  return (
    <React.Suspense
      fallback={
        <div>
          <Spinner />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <QueryClientProvider client={queryClient}>
          {process.env.NODE_ENV !== 'test' && <ReactQueryDevtools />}
          <Notifications />
          <AuthProvider>
            <Router>
              <ChakraProvider>{children}</ChakraProvider>
            </Router>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
