import { Box, Spinner as ChakraSpinner } from '@chakra-ui/react';
import React from 'react';

export function Spinner({ paddingTop = '200px', ...styles }) {
  return (
    <Box textAlign="center" paddingTop={paddingTop} overflow="hidden" {...styles}>
      <ChakraSpinner size="xl" />
    </Box>
  );
}
