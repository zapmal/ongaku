import { styled } from '@/stitches.config.js';

export const Header = styled('header', {
  display: 'flex',
  justifyContent: 'space-between',

  '& img': {
    width: '150px',
  },

  '@sm': {
    // justifyContent: 'center',
    // '& img': {
    //   display: 'none',
    // },
  },
});
