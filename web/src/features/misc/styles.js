import { styled } from '@/stitches.config.js';

export const Background = styled('div', {
  backgroundColor: '$primaryBase',
  height: '100vh',
});

export const ArtistImage = styled('img', {
  height: '100%',
  width: '50%',
});

export const NavigationBar = styled('nav', {
  position: 'fixed',
  top: 0,
  width: '100%',
  textAlign: 'right',
  paddingTop: '$3',
  paddingRight: '$8',

  '& *': {
    fontSize: '$sm',
  },
});
