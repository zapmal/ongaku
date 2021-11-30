import React from 'react';

import { styled } from '@/stitches.config.js';

const StyledCard = styled('div', {
  borderRadius: '20px',
  padding: '20px 50px',
  maxWidth: '350px',
  textAlign: 'center',
  backgroundColor: 'rgba(111, 111, 111, 0.4)',
  filter: 'drop-shadow(10px 10px 4px rgba(0, 0, 0, 0.25))',
  transition: '200ms ease-in-out',

  '&:hover': {
    backgroundColor: 'rgba(111, 111, 111, 0.70)',
  },

  '& p:last-of-type': {
    marginTop: '20px',
  },

  '@sm': {
    padding: '20px 30px',
  },
});

export function Card({ children, ...extraProps }) {
  return <StyledCard {...extraProps}>{children}</StyledCard>;
}
