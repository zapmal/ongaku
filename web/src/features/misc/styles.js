import { styled } from '@/stitches.config.js';

export const Background = styled('div', {
  backgroundColor: '$primaryBase',
});

export const ArtistImage = styled('img', {
  height: '100vh',
});

export const NavigationBar = styled('nav', {
  width: '100%',
  paddingTop: '$4',
  textAlign: 'center',

  '& *': {
    fontSize: '$sm',
  },
});
