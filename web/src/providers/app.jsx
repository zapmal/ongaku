import { ChakraProvider, extendTheme, Box, Heading, Text, Image } from '@chakra-ui/react';
import { StepsStyleConfig } from 'chakra-ui-steps';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { MdCached } from 'react-icons/md';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router } from 'react-router-dom';

import { Button } from '@/components/Elements';
import { Notifications } from '@/components/Notifications';
import { Highlight, Spinner } from '@/components/Utils';
import { queryClient } from '@/lib/react-query';
import { theme } from '@/stitches.config.js';

// Parts that can be customized: https://github.com/jeanverster/chakra-ui-steps/blob/a11db0a42001ffb6ce39612880a2f6df168621bc/src/theme/index.ts#L9-L19
// Example of how to use it: https://github.com/jeanverster/chakra-ui-steps/issues/27
const CustomizedSteps = {
  ...StepsStyleConfig,
  baseStyle: {
    stepIconContainer: {
      bg: 'pink.500',
      borderColor: 'pink.500',
    },
    label: {
      color: 'white',
    },
    description: {
      color: 'whiteAlpha.700',
    },
  },
};

const chakraTheme = extendTheme({
  styles: {
    global: {
      'html, body': {
        backgroundColor: theme.colors.primaryBase.value,
        color: '#ffffff',
        // overflowX: 'hidden',
      },
      img: {
        width: '100%',
      },
    },
  },
  components: {
    Steps: CustomizedSteps,
    Modal: {
      baseStyle: {
        dialog: {
          bg: theme.colors.primaryBase.value,
        },
      },
    },
  },
});

export const AppProvider = ({ children }) => {
  return (
    <ChakraProvider theme={chakraTheme}>
      <React.Suspense fallback={<Spinner />}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <QueryClientProvider client={queryClient}>
            {process.env.NODE_ENV !== 'test' && <ReactQueryDevtools />}
            {/* <AuthProvider> */}
            <Router>
              <Notifications />
              {children}
            </Router>
            {/* </AuthProvider> */}
          </QueryClientProvider>
        </ErrorBoundary>
      </React.Suspense>
    </ChakraProvider>
  );
};

function ErrorFallback() {
  return (
    <Box align="center" paddingTop={['40px', '20px']}>
      <Heading size="xl">
        Oops, <Highlight>algo salió mal</Highlight>
      </Heading>
      <Text
        textAlign="center"
        color={theme.colors.primaryTextContrast.value}
        padding="20px"
        fontSize="lg"
      >
        Pero no te asustes, no fue tu culpa. ¿Porqué no lo intentas <Highlight>otra vez?</Highlight>
      </Text>

      <Button
        onClick={() => window.location.assign(window.location.origin)}
        variant="accent"
        margin="20px"
        size="lg"
        rightIcon={<MdCached size={25} />}
      >
        Ir a Inicio
      </Button>

      <Image src="/assets/svgs/undraw-lost.svg" width={['300px', '400px']} margin="5px" />
    </Box>
  );
}
