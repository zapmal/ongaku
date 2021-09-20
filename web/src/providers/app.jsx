import { Spinner, ChakraProvider, extendTheme, Box, Heading, Text, Image } from '@chakra-ui/react';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { MdCached } from 'react-icons/md';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router } from 'react-router-dom';

import { Button, Highlight } from '@/components/Elements';
import { Notifications } from '@/components/Notifications';
import { queryClient } from '@/lib/react-query';
import { AuthProvider } from '@/providers/auth';
import { theme } from '@/stitches.config.js';

const chakraTheme = extendTheme({
  styles: {
    global: {
      'html, body': {
        backgroundColor: theme.colors.primaryBase.value,
        color: '#ffffff',
      },
    },
  },
});

export const AppProvider = ({ children }) => {
  return (
    <ChakraProvider theme={chakraTheme}>
      <React.Suspense fallback={LoadingFallback}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <QueryClientProvider client={queryClient}>
            {process.env.NODE_ENV !== 'test' && <ReactQueryDevtools />}
            <AuthProvider>
              <Router>
                <Notifications />
                {children}
              </Router>
            </AuthProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </React.Suspense>
    </ChakraProvider>
  );
};

function LoadingFallback() {
  return (
    <Box textAlign="center" paddingTop="200px">
      <Spinner size="xl" />
    </Box>
  );
}

function ErrorFallback() {
  return (
    <Box align="center" paddingTop="8">
      <Heading size="xl">
        Oops, <Highlight>something went wrong</Highlight>
      </Heading>
      <Text
        textAlign="center"
        color={theme.colors.primaryTextContrast.value}
        padding="5"
        fontSize="lg"
      >
        But {"don't"} fret — {"it's"} not your fault. Why {"don't"} we give it{' '}
        <Highlight>another chance?</Highlight>
      </Text>

      <Image src="/assets/svgs/undraw-lost.svg" width="400px" margin="5" />

      <Button
        onClick={() => window.location.assign(window.location.origin)}
        variant="accent"
        isFullWidth={false}
        extraProps={{ margin: '20px', rightIcon: <MdCached /> }}
      >
        Refresh
      </Button>
    </Box>
  );
}
