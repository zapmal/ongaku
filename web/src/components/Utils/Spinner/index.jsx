import { Box, Spinner as ChakraSpinner } from '@chakra-ui/react';
import React from 'react';

export function Spinner() {
  return (
    <Box textAlign="center" paddingTop="200px" overflow="hidden">
      <ChakraSpinner size="xl" />
    </Box>
  );
}
