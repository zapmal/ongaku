import { Image } from '@chakra-ui/react';

import { styled } from '@/stitches.config.js';

export const Background = styled('div', {
  backgroundColor: '$primaryBase',
});

export const ArtistImage = styled(Image, {
  height: '100vh',
  width: '100%',
});

export const HeaderContainer = styled('header', {
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
});
