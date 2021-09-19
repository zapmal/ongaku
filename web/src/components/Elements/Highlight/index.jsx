import React from 'react';

import { styled } from '@/stitches.config.js';

const StyledHighlight = styled('strong', {
  variants: {
    variant: {
      primary: {
        color: '$primaryTextContrast',
      },
      accent: {
        color: '$accentSolid',
      },
    },
  },
});

export function Highlight({ variant = 'primary', children }) {
  return <StyledHighlight variant={variant}>{children}</StyledHighlight>;
}
