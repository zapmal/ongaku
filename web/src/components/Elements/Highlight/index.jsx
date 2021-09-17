import React from 'react';

import { styled } from '@/stitches.config.js';

const StyledHighlight = styled('strong', {
  variants: {
    tone: {
      primary: {
        color: '$primaryTextContrast',
      },
      accent: {
        color: '$accentSolid',
      },
    },
  },
});

export function Highlight({ tone = 'primary', children }) {
  return <StyledHighlight tone={tone}>{children}</StyledHighlight>;
}
