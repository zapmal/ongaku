import { keyframes } from '@chakra-ui/react';

import { theme } from '@/stitches.config.js';

export const MENU_ITEM_PROPS = {
  _hover: {
    bg: theme.colors.primaryBgHover.value,
  },
  _active: {
    bg: theme.colors.primaryBgActive.value,
    color: theme.colors.accentSolidActive.value,
  },
  _focus: {
    bg: theme.colors.primaryBgActive.value,
    color: theme.colors.accentSolidActive.value,
  },
};

export const SECTION_MARGIN = '50px 20px 20px 20px';
export const SUB_SECTION_MARGIN = '20px';
export const GRID_COLUMN_HEIGHT = '300px';
export const GRADIENTS = {
  // old one used on the banner
  // top: `linear-gradient(180deg, ${theme.colors.primaryBase.value} -5%, rgba(255,255,255,0) 15%)`,
  top: `linear-gradient(180deg, ${theme.colors.primaryBase.value} -60%, rgba(255,255,255,0) 100%)`,
  bottom: `linear-gradient(0, ${theme.colors.primaryBase.value} 5%, rgba(255,255,255,0) 60%)`,
};

const fadeOutSteps = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
export const FADE_OUT_ANIMATION = `${fadeOutSteps} 300ms linear`;

// Mock data that will be used temporarily.
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
      type: 'ALBUM',
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
      authors: '(G) I-DLE, K/DA, Madison Beer, Lexie Liu, Jaira Burns',
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
    type: 'SINGLE',
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
    amountOfFollowers: '892,092',
    image: '/assets/images/static-artist-mori.jpg',
    to: '/artist/mori-calliope',
  },
  {
    name: 'TWICE',
    amountOfFollowers: '10,763,588',
    image: '/assets/images/static-artist-twice.jpeg',
    to: '/artist/twice',
  },
  {
    name: 'The Gentlemen',
    amountOfFollowers: '750,379',
    image: '/assets/images/static-artist-gentlemen.jpg',
    to: '/artist/the-gentlemen',
  },
  {
    name: 'Yung Iverson',
    amountOfFollowers: '102,838',
    image: '/assets/images/static-artist-yung-iverson.jpg',
    to: '/artist/yung-iverson',
  },
];
export const PERFECT_FOR_YOU = [
  {
    name: 'DEMONDICE',
    youtubeChannelURL: 'https://youtube.com/DEMONDICEKAREN',
    pageURL: '/artist/DEMONDICE',
    description:
      'Karen, better known online as DEMONDICE, is an American YouTuber living in Japan who is most known for her rap, MV production and animations',
    genres: 'Hip-Hop, Rap, Jazz Rap, Pop Rap',
    monthlyListeners: '403,871',
    followers: '103,948',
    image: '/assets/images/static-artist-og-mori.jpeg',
  },
];
export const TRENDING = [
  {
    cardType: 'song',
    name: 'Human',
    isExplicit: false,
    type: 'ALBUM',
    cover: '/assets/images/static-trending-human.jpg',
    authors: "Rag'n'Bone Man",
    year: 2017,
  },
  {
    cardType: 'song',
    name: 'Kawaki wo Ameku',
    isExplicit: false,
    type: 'EP',
    cover: '/assets/images/static-trending-kawaki-wo-ameku.jpg',
    authors: 'Minami',
    year: 2019,
  },
  {
    cardType: 'artist',
    name: 'Bea Miller',
    amountOfFollowers: '8,403,812',
    image: '/assets/images/static-trending-bea-miller.jpg',
    to: '/artist/bea-miller',
  },
  {
    cardType: 'artist',
    name: 'PVRIS',
    amountOfFollowers: '3,111,992',
    image: '/assets/images/static-trending-pvris.jpg',
    to: '/artist/pvris',
  },
  {
    cardType: 'song',
    name: 'Speed of Light',
    isExplicit: false,
    type: 'SINGLE',
    cover: '/assets/images/static-trending-speed-of-light.jpg',
    authors: 'DJ Okawari, AI ninomiya',
    year: 2019,
  },
];
export const SONGS_IN_QUEUE = [
  { name: 'Morphogenetic Sorrow', authors: 'Shinji Hosoe', duration: '4:03' },
  { name: 'Blue Bird Lamentation', authors: 'Shinji Hosoe', duration: '3:33' },
  { name: 'INDUSTRY BABY', authors: 'Lil Nas X, Jack Harlow', duration: '2:22', isExplicit: true },
  { name: 'Watch Me', authors: 'The Phantoms', duration: '3:35' },
  { name: 'Blood Sweat & Tears', authors: 'BTS', duration: '3:37' },
  { name: 'guh', authors: 'Mori Calliope', duration: '3:02' },
  {
    name: 'POP/STARS',
    authors: 'K/DA, Madison Beer, (G)-IDLE, League of Legends',
    duration: '3:11',
  },
  { name: 'Aftershock', authors: 'Pentakill', duration: '3:31' },
  { name: 'Last of Me', authors: 'Steve Aoki, RUNN', duration: '3:02' },
  { name: 'Monster', authors: 'PVRIS', duration: '2:59' },
];

export const ARTISTS_IN_LIBRARY = [
  {
    cardType: 'artist',
    name: 'Bea Miller',
    amountOfFollowers: '8,403,812',
    image: '/assets/images/static-trending-bea-miller.jpg',
    to: '/artist/bea-miller',
  },
  {
    cardType: 'artist',
    name: 'Bea Miller',
    amountOfFollowers: '8,403,812',
    image: '/assets/images/static-trending-bea-miller.jpg',
    to: '/artist/bea-miller',
  },
  {
    cardType: 'artist',
    name: 'Bea Miller',
    amountOfFollowers: '8,403,812',
    image: '/assets/images/static-trending-bea-miller.jpg',
    to: '/artist/bea-miller',
  },
  {
    cardType: 'artist',
    name: 'Bea Miller',
    amountOfFollowers: '8,403,812',
    image: '/assets/images/static-trending-bea-miller.jpg',
    to: '/artist/bea-miller',
  },
  {
    cardType: 'artist',
    name: 'Bea Miller',
    amountOfFollowers: '8,403,812',
    image: '/assets/images/static-trending-bea-miller.jpg',
    to: '/artist/bea-miller',
  },
  {
    cardType: 'artist',
    name: 'Bea Miller',
    amountOfFollowers: '8,403,812',
    image: '/assets/images/static-trending-bea-miller.jpg',
    to: '/artist/bea-miller',
  },
  {
    cardType: 'artist',
    name: 'Bea Miller',
    amountOfFollowers: '8,403,812',
    image: '/assets/images/static-trending-bea-miller.jpg',
    to: '/artist/bea-miller',
  },
  {
    cardType: 'artist',
    name: 'Bea Miller',
    amountOfFollowers: '8,403,812',
    image: '/assets/images/static-trending-bea-miller.jpg',
    to: '/artist/bea-miller',
  },
];

export const PLAYLISTS_IN_LIBRARY = [
  {
    name: 'AVARICIA',
    cover: '/assets/images/static-playlist-avaricia.png',
    likes: 487,
    amountOfSongs: 412,
    author: 'pur_oblingbling',
  },
  {
    name: 'AVARICIA',
    cover: '/assets/images/static-playlist-avaricia.png',
    likes: 487,
    amountOfSongs: 412,
    author: 'pur_oblingbling',
  },
  {
    name: 'AVARICIA',
    cover: '/assets/images/static-playlist-avaricia.png',
    likes: 487,
    amountOfSongs: 412,
    author: 'pur_oblingbling',
  },
  {
    name: 'AVARICIA',
    cover: '/assets/images/static-playlist-avaricia.png',
    likes: 487,
    amountOfSongs: 412,
    author: 'pur_oblingbling',
  },
  {
    name: 'AVARICIA',
    cover: '/assets/images/static-playlist-avaricia.png',
    likes: 487,
    amountOfSongs: 412,
    author: 'pur_oblingbling',
  },
];

export const ALBUMS_IN_LIBRARY = [
  {
    name: 'Kawaki wo Ameku',
    isExplicit: false,
    type: 'EP',
    cover: '/assets/images/static-trending-kawaki-wo-ameku.jpg',
    authors: 'Minami',
    year: 2019,
  },

  {
    name: 'Kawaki wo Ameku',
    isExplicit: false,
    type: 'EP',
    cover: '/assets/images/static-trending-kawaki-wo-ameku.jpg',
    authors: 'Minami',
    year: 2019,
  },
  {
    name: 'Kawaki wo Ameku',
    isExplicit: false,
    type: 'EP',
    cover: '/assets/images/static-trending-kawaki-wo-ameku.jpg',
    authors: 'Minami',
    year: 2019,
  },
  {
    name: 'Kawaki wo Ameku',
    isExplicit: false,
    type: 'EP',
    cover: '/assets/images/static-trending-kawaki-wo-ameku.jpg',
    authors: 'Minami',
    year: 2019,
  },
];

export const NEW_SONGS = [
  {
    name: 'Kawaki wo Ameku',
    isExplicit: false,
    type: 'EP',
    cover: '/assets/images/static-trending-kawaki-wo-ameku.jpg',
    authors: 'Minami',
    albumName: 'Kawaki wo Ameku',
    year: 2019,
    duration: '3:11',
  },
  {
    name: 'Speed of Light',
    isExplicit: false,
    type: 'SINGLE',
    cover: '/assets/images/static-trending-speed-of-light.jpg',
    authors: 'DJ Okawari, AI ninomiya',
    albumName: 'Arknights Official OST',
    year: 2019,
    duration: '3:11',
  },
  {
    name: 'Kawaki wo Ameku',
    isExplicit: false,
    type: 'EP',
    cover: '/assets/images/static-trending-kawaki-wo-ameku.jpg',
    authors: 'Minami',
    albumName: 'Kawaki wo Ameku',
    year: 2019,
    duration: '3:11',
  },
  {
    name: 'Speed of Light',
    isExplicit: false,
    type: 'SINGLE',
    cover: '/assets/images/static-trending-speed-of-light.jpg',
    authors: 'DJ Okawari, AI ninomiya',
    albumName: 'Arknights Official OST',
    year: 2019,
    duration: '3:11',
  },
];

export const NEW_ARTISTS = [
  {
    name: 'The Gentlemen',
    amountOfFollowers: '750,379',
    image: '/assets/images/static-artist-gentlemen.jpg',
    to: '/artist/the-gentlemen',
  },
  {
    name: 'Yung Iverson',
    amountOfFollowers: '102,838',
    image: '/assets/images/static-artist-yung-iverson.jpg',
    to: '/artist/yung-iverson',
  },
  {
    name: 'The Gentlemen',
    amountOfFollowers: '750,379',
    image: '/assets/images/static-artist-gentlemen.jpg',
    to: '/artist/the-gentlemen',
  },
  {
    name: 'Yung Iverson',
    amountOfFollowers: '102,838',
    image: '/assets/images/static-artist-yung-iverson.jpg',
    to: '/artist/yung-iverson',
  },
];
