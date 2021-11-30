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
      gray: {
        color: '$primaryText',
      },
    },
  },
});

export function Highlight({ variant = 'accent', children }) {
  return <StyledHighlight variant={variant}>{children}</StyledHighlight>;
}
