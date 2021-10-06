import { styled } from '@/stitches.config.js';

export const Header = styled('header', {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',

  '& div': {
    paddingTop: '$3',
    verticalAlign: 'center',
  },

  '& div:last-child': {
    paddingRight: '$3',
  },

  '& img': {
    width: '150px',
    display: 'inline',
  },

  '@sm': {
    justifyContent: 'center',
    '& div:last-child': {
      paddingRight: '0',
    },
    '& img': {
      display: 'none',
    },
  },
});
