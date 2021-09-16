import { Button, Spinner, ChakraProvider, extendTheme } from '@chakra-ui/react';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router } from 'react-router-dom';

import { Notifications } from '@/components/Notifications';
import { queryClient } from '@/lib/react-query';
import { AuthProvider } from '@/providers/auth';

/**
 * Button needs to be custom (stitches) because this is
 * not rendered under chakra's provider.
 */
const ErrorFallback = () => {
  return (
    <div role="alert">
      <h2>Ooops, something went wrong.</h2>
      <Button onClick={() => window.location.assign(window.location.origin)}>Refresh</Button>
    </div>
  );
};

const chakraTheme = extendTheme({
  styles: {
    global: {
      'html, body': {
        color: '#ffffff',
      },
    },
  },
});

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
          <AuthProvider>
            <Router>
              <ChakraProvider theme={chakraTheme}>
                <Notifications />
                {children}
              </ChakraProvider>
            </Router>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
