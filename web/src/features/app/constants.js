import { theme } from '@/stitches.config.js';

// This should be responsive.
export const GRID_COLUMN_HEIGHT = '300px';
export const GRADIENTS = {
  top: `linear-gradient(180deg, ${theme.colors.primaryBase.value} 0%, rgba(255,255,255,0) 25%)`,
  bottom: `linear-gradient(0, ${theme.colors.primaryBase.value} 5%, rgba(255,255,255,0) 60%)`,
};

/**
 * Mock data that will be used temporarily.
 */

export const FEATURED_ARTIST = {
  name: '(G) I-DLE',
  amountOfFollowers: '2,123,505 followers',
  description: `South Korean girl group formed by Cube Entertainment in 2018. The group consists of
  five members: Miyeon, Minnie, Soyeon, Yuqi, and Shuhua. Originally a six-piece Soojin
  departed from the group on August 14, 2021.`,
  songs: [
    {
      name: 'OH MY GOD',
      isExplicit: true,
      type: 'SONG',
      cover: '/assets/images/static-oh-my-god.jpg',
      yearAndAuthors: '2020- (G) I-DLE',
    },
    {
      name: 'I TRUST',
      isExplicit: false,
      type: 'EP',
      cover: '/assets/images/static-i-trust.webp',
      yearAndAuthors: '2020- (G) I-DLE',
    },
    {
      name: 'MORE',
      isExplicit: false,
      type: 'SINGLE',
      cover: '/assets/images/static-more.jpg',
      yearAndAuthors: '2020 - (G) I-DLE', // K/DA and more
    },
  ],
};
export const RECENTLY_PLAYED = [];
export const SUGGESTED_ARTISTS = [];
export const PERFECT_FOR_YOU = '';
export const TRENDING = [];
