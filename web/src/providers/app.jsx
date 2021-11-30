import { Spinner, ChakraProvider, extendTheme, Box, Heading, Text, Image } from '@chakra-ui/react';
import { StepsStyleConfig as Steps } from 'chakra-ui-steps';
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
        overflowX: 'hidden',
      },
      img: {
        width: '100%',
      },
    },
  },
  components: {
    Steps,
  },
});

export const AppProvider = ({ children }) => {
  return (
    <ChakraProvider theme={chakraTheme}>
      <React.Suspense fallback={<LoadingFallback />}>
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
    <Box textAlign="center" paddingTop="200px" overflow="hidden">
      <Spinner size="xl" />
    </Box>
  );
}

function ErrorFallback() {
  return (
    <Box align="center" paddingTop={['40px', '20px']}>
      <Heading size="xl">
        Oops, <Highlight>something went wrong</Highlight>
      </Heading>
      <Text
        textAlign="center"
        color={theme.colors.primaryTextContrast.value}
        padding="20px"
        fontSize="lg"
      >
        But {"don't"} fret — {"it's"} not your fault. Why {"don't"} we give it{' '}
        <Highlight>another chance?</Highlight>
      </Text>

      <Image src="/assets/svgs/undraw-lost.svg" width={['300px', '400px']} margin="15px" />

      <Button
        onClick={() => window.location.assign(window.location.origin)}
        variant="accent"
        isFullWidth={false}
        margin="20px"
        rightIcon={<MdCached />}
      >
        Refresh
      </Button>
    </Box>
  );
}
