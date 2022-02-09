import { Box } from '@chakra-ui/react';
import React from 'react';

export function Banner({ image, children, ...extraStyles }) {
  return (
    <Box
      bg={`url(/assets/images/${image})`}
      bgRepeat="round"
      height="700px"
      width="100%"
      {...extraStyles}
    >
      {children}
    </Box>
  );
}
