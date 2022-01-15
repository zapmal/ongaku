import { Link as ChakraLink } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { theme } from '@/stitches.config.js';

const variants = {
  primary: theme.colors.primaryTextContrast.value,
  accent: theme.colors.accentSolid.value,
  gray: theme.colors.primaryText.value,
};

export function Link({ to, variant = 'primary', underline = true, children, ...extraProps }) {
  return (
    <ChakraLink
      as={RouterLink}
      to={to}
      color={variants[variant]}
      _hover={{
        textDecoration: !underline && 'underline',
      }}
      textDecoration={underline && 'underline'}
      {...extraProps}
    >
      {children}
    </ChakraLink>
  );
}
