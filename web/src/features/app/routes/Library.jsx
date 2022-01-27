import { Box, Image, Flex, Divider, Text, SimpleGrid } from '@chakra-ui/react';
import React, { useState } from 'react';

import { ArtistCard, PlaylistCard, SongCard } from '../components';
import {
  PARENT_BOX_MARGIN,
  ARTISTS_IN_LIBRARY,
  PLAYLISTS_IN_LIBRARY,
  ALBUMS_IN_LIBRARY,
} from '../constants';

import { theme } from '@/stitches.config.js';

export function Library() {
  const [selected, setSelected] = useState('artist');
  let optionToRender = null;
  let numberOfColumns = 0;

  switch (selected) {
    case 'artist': {
      optionToRender = <Artists />;
      numberOfColumns = Math.ceil(ARTISTS_IN_LIBRARY.length / 2) + 1;
      break;
    }
    case 'album': {
      optionToRender = <Albums />;
      numberOfColumns = Math.ceil(ALBUMS_IN_LIBRARY.length / 2) + 1;
      break;
    }
    case 'playlist': {
      optionToRender = <Playlists />;
      numberOfColumns = Math.ceil(PLAYLISTS_IN_LIBRARY.length / 2) + 1;
      break;
    }
  }

  return (
    <Box margin={PARENT_BOX_MARGIN} minHeight="455px" maxHeight="700px">
      <Flex gap={20} justify="center">
        <LibraryOption onClick={() => setSelected('artist')} selected={selected === 'artist'}>
          Artists
        </LibraryOption>
        <LibraryOption onClick={() => setSelected('playlist')} selected={selected === 'playlist'}>
          Playlists
        </LibraryOption>
        <LibraryOption onClick={() => setSelected('album')} selected={selected === 'album'}>
          Albums
        </LibraryOption>
      </Flex>

      <Divider width="50%" margin="10px auto" />

      {numberOfColumns <= 4 ? (
        <Flex justify="center" gap="20px">
          {optionToRender}
        </Flex>
      ) : (
        <SimpleGrid columns={numberOfColumns} justifyItems="center">
          {optionToRender}
        </SimpleGrid>
      )}

      <Image src="/assets/images/home-footer.png" width="500px" margin={`25px auto`} />
    </Box>
  );
}

function Artists() {
  return ARTISTS_IN_LIBRARY.map((artist, index) => (
    <Box margin="10px 0" key={index}>
      <ArtistCard
        name={artist.name}
        image={artist.image}
        amountOfFollowers={artist.amountOfFollowers}
        to={artist.to}
        badge={false}
        size="sm"
      />
    </Box>
  ));
}

function Albums() {
  return ALBUMS_IN_LIBRARY.map((album, index) => (
    <Box margin="10px 0" key={index}>
      <SongCard
        key={index}
        cover={album.cover}
        name={album.name}
        isExplicit={album.isExplicit}
        type={album.type}
        authors={album.authors}
        year={album.year}
      />
    </Box>
  ));
}

function Playlists() {
  return PLAYLISTS_IN_LIBRARY.map((playlist, index) => (
    <Box margin="10px 0" key={index}>
      <PlaylistCard
        key={index}
        cover={playlist.cover}
        name={playlist.name}
        likes={playlist.likes}
        amountOfSongs={playlist.amountOfSongs}
        author={playlist.author}
        badge={false}
      />
    </Box>
  ));
}

function LibraryOption({ selected, onClick, children }) {
  return (
    <Text
      fontSize="xl"
      onClick={onClick}
      color={selected ? theme.colors.accentText.value : 'whiteAlpha.900'}
      fontWeight="bold"
      _hover={{
        color: theme.colors.accentText.value,
        cursor: 'pointer',
      }}
      transition="all 150ms ease-in"
    >
      {children}
    </Text>
  );
}
