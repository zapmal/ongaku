import {
  Box,
  Flex,
  Divider,
  Center,
  Text,
  SimpleGrid,
  Heading,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useQuery } from 'react-query';

import { getLikedPlaylists } from '../api/playlist';
import {
  ArtistCard,
  PlaylistCard,
  LikedSongsPlaylist,
  SongCard,
  CreateNewPlaylist,
  Status,
} from '../components';
import { ARTISTS_IN_LIBRARY, PLAYLISTS_IN_LIBRARY, ALBUMS_IN_LIBRARY } from '../constants';

import { Footer } from '@/components/Core';
import { Button, Link } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
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
      <Box minHeight="455px" maxHeight="100%" margin="0 20px 0 40px">
        <Flex gap={20} justify="center">
          <LibraryOption onClick={() => setSelected('artist')} selected={selected === 'artist'}>
            Artistas
          </LibraryOption>
          <LibraryOption onClick={() => setSelected('playlist')} selected={selected === 'playlist'}>
            Playlists
          </LibraryOption>
          <LibraryOption onClick={() => setSelected('album')} selected={selected === 'album'}>
            Albumes
          </LibraryOption>
        </Flex>

        <Divider width="50%" margin="10px auto" />

        {selected === 'playlist' && (
          <Center>
            <Button rightIcon={<MdAdd />} margin="10px auto" onClick={onOpen}>
              Crea una nueva playlist
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
  console.log('Querying artists');
  return ARTISTS_IN_LIBRARY.map((artist, index) => (
    <Box margin="10px 0" key={index}>
      <ArtistCard
        name={artist.name}
        avatar={artist.image}
        amountOfFollowers={artist.amountOfFollowers}
        to={artist.to}
        badge={false}
        size="sm"
      />
    </Box>
  ));
}

function Albums() {
  console.log('Querying albums');
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
  const { data, isLoading, isError, error } = useQuery('playlists', getLikedPlaylists);

  if (isLoading) {
    return <Status status="loading" message="Loading playlists..." />;
  }

  if (isError) {
    return <Status status="error" message={error} />;
  }

  return data.playlists.length === 0 ? (
    <Box textAlign="center" position="absolute" top="200px">
      <Heading fontSize="2xl">
        No has creado o marcado como favorita ni una <Highlight>playlist</Highlight>
      </Heading>
      <Text color="whiteAlpha.700" marginTop="10px" fontSize="lg">
        ¿Porqué no lo intentas?
      </Text>
      <Text color="whiteAlpha.700" marginTop="10px">
        Presiona el botón que está arriba o visita la{' '}
        <Link to="/explore">página de exploración</Link> para empezar.
      </Text>
    </Box>
  ) : (
    data.playlists.map((playlist, index) => (
      <Box margin="10px 0" key={index}>
        <PlaylistCard
          key={index}
          cover={`${import.meta.env.VITE_NODE_API_URL}/static/playlist/${playlist.cover}`}
          name={playlist.name}
          likes={playlist.likes}
          amountOfSongs={0}
          author={playlist.username}
          badge={false}
          notLikeable={true}
        />
      </Box>
    ))
  );
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
