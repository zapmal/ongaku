import { Box, Flex, Divider, Center, Text, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';

import {
  ArtistCard,
  PlaylistCard,
  LikedSongsPlaylist,
  SongCard,
  CreateNewPlaylist,
} from '../components';
import { ARTISTS_IN_LIBRARY, PLAYLISTS_IN_LIBRARY, ALBUMS_IN_LIBRARY } from '../constants';

import { Footer } from '@/components/Core';
import { Button } from '@/components/Elements';
import { theme } from '@/stitches.config.js';

export function Library() {
  const [selected, setSelected] = useState('artist');
  const { onOpen, onClose, isOpen } = useDisclosure();

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
      optionToRender = (
        <>
          <Box marginTop="10px">
            <LikedSongsPlaylist />
          </Box>
          <Playlists />
        </>
      );
      numberOfColumns = Math.ceil(PLAYLISTS_IN_LIBRARY.length / 2) + 2;
      break;
    }
  }

  return (
    <>
      <Box minHeight="455px" maxHeight="700px" margin="0 20px 0 40px">
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

        {selected === 'playlist' && (
          <Center>
            <Button rightIcon={<MdAdd />} margin="10px auto" onClick={onOpen}>
              Create a new Playlist
            </Button>
          </Center>
        )}

        {numberOfColumns <= 4 ? (
          <Flex justify="center" gap="20px">
            {optionToRender}
          </Flex>
        ) : (
          <SimpleGrid columns={numberOfColumns} justifyItems="center">
            {optionToRender}
          </SimpleGrid>
        )}
        <Footer topMargin="25px" />
      </Box>
      {isOpen && <CreateNewPlaylist isOpen={isOpen} onClose={onClose} />}
    </>
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
