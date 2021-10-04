import { Link as ChakraLink } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { theme } from '@/stitches.config.js';

const variants = {
  primary: theme.colors.primaryTextContrast.value,
  accent: theme.colors.accentSolid.value,
  gray: theme.colors.primaryText.value,
};

export function Link({ to, variant = 'primary', underline = true, children, ...props }) {
  const hasUnderline = underline ? { textDecoration: 'underline' } : null;
  return (
    <ChakraLink as={RouterLink} to={to} color={variants[variant]} {...hasUnderline} {...props}>
      {children}
    </ChakraLink>
  );
}
