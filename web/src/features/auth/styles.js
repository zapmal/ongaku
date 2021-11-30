import { styled } from '@/stitches.config.js';

export const Header = styled('header', {
  display: 'flex',
  justifyContent: 'space-between',

  '& img': {
    width: '150px',
  },

  '& div': {
    marginTop: '30px',
    verticalAlign: 'center',
  },

  '& div:last-child': {
    paddingRight: '$5',
  },

  '@sm': {
    // justifyContent: 'center',
    // '& img': {
    //   display: 'none',
    // },
  },
});
