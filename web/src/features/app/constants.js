import { keyframes } from '@chakra-ui/react';

import { theme } from '@/stitches.config.js';

export const GRID_COLUMN_HEIGHT = '300px';
export const GRADIENTS = {
  top: `linear-gradient(180deg, ${theme.colors.primaryBase.value} -5%, rgba(255,255,255,0) 15%)`,
  bottom: `linear-gradient(0, ${theme.colors.primaryBase.value} 5%, rgba(255,255,255,0) 60%)`,
};

const fadeOutSteps = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
export const FADE_OUT_ANIMATION = `${fadeOutSteps} 300ms linear`;

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
      authors: '(G) I-DLE',
      year: 2020,
    },
    {
      name: 'I TRUST',
      isExplicit: false,
      type: 'EP',
      cover: '/assets/images/static-i-trust.webp',
      authors: '(G) I-DLE',
      year: 2020,
    },
    {
      name: 'MORE',
      isExplicit: false,
      type: 'SINGLE',
      cover: '/assets/images/static-more.jpg',
      authors: '(G) I-DLE, K/DA and more',
      year: 2020,
    },
  ],
};
export const RECENTLY_PLAYED = [
  {
    cardType: 'playlist',
    name: 'SOYEON FOCUS',
    cover: '/assets/images/static-playlist-soyeon.jpeg',
    likes: 832,
    amountOfSongs: 17,
    author: 'Zapmal',
  },
  {
    cardType: 'song',
    name: 'SAQUENME DE VENEZUELA',
    isExplicit: true,
    type: 'SONG',
    cover: '/assets/images/static-song-saquenme-de-vzla.jpeg',
    authors: 'Yung Iverson',
    year: 2019,
  },
  {
    cardType: 'playlist',
    name: 'Bad BOI',
    cover: '/assets/images/static-playlist-bad-boi.jpg',
    likes: 34,
    amountOfSongs: 77,
    author: 'bom_banal',
  },
  {
    cardType: 'playlist',
    name: '- Risas -',
    cover: '/assets/images/static-playlist-risas.png',
    likes: 444,
    amountOfSongs: 4,
    author: 'X_Blackie_X',
  },
  {
    cardType: 'playlist',
    name: 'Rough Waves',
    cover: '/assets/images/static-playlist-rough-waves.png',
    likes: 3094,
    amountOfSongs: 102,
    author: 'sad_tuna',
  },
  {
    cardType: 'playlist',
    name: 'AVARICIA',
    cover: '/assets/images/static-playlist-avaricia.png',
    likes: 487,
    amountOfSongs: 412,
    author: 'pur_oblingbling',
  },
];
export const SUGGESTED_ARTISTS = [
  {
    name: 'Mori Calliope',
    amountOfFollowers: '892.092',
    image: '/assets/images/static-artist-mori.jpg',
  },
  {
    name: 'TWICE',
    amountOfFollowers: '10,763,588',
    image: '/assets/images/static-artist-twice.jpeg',
  },
  {
    name: 'The Gentlemen',
    amountOfFollowers: '750,379',
    image: '/assets/images/static-artist-gentlemen.jpg',
  },
  {
    name: 'Yung Iverson',
    amountOfFollowers: '102,838',
    image: '/assets/images/static-artist-yung-iverson.jpg',
  },
];
export const PERFECT_FOR_YOU = '';
export const TRENDING = [];
