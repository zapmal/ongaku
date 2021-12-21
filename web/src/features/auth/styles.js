import { styled } from '@/stitches.config.js';

export const NavigationBar = styled('header', {
  display: 'flex',
  justifyContent: 'space-between',

  '& img': {
    width: '150px',
    maxHeight: "102px",
  },
});
