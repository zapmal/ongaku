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
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useQuery } from 'react-query';

import { getLikedAlbums } from '../api/album';
import { getFollowedArtists } from '../api/artist';
import { getLikedPlaylists } from '../api/playlist';
import {
  ArtistCard,
  PlaylistCard,
  LikedSongsPlaylist,
  SongCard,
  CreateNewPlaylist,
  Status,
} from '../components';

import { Button, Link } from '@/components/Elements';
import { theme } from '@/stitches.config.js';
import { getImage } from '@/utils/getImage';

export function Library() {
  const [selected, setSelected] = useState('artist');
  const { onOpen, onClose, isOpen } = useDisclosure();

  let optionToRender = null;

  switch (selected) {
    case 'artist': {
      optionToRender = <Artists />;
      break;
    }
    case 'album': {
      optionToRender = <Albums />;
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

        {/* {numberOfColumns <= 4 ? (
          <Flex justify="center" gap="20px">
            {optionToRender}
          </Flex>
        ) : ( */}
        <SimpleGrid columns={4} justifyItems="center">
          {optionToRender}
        </SimpleGrid>
        {/* )} */}
      </Box>
      {isOpen && <CreateNewPlaylist isOpen={isOpen} onClose={onClose} />}
    </>
  );
}

function Artists() {
  const { data, isLoading, isError, error } = useQuery('library-artists', getFollowedArtists);

  if (isLoading) {
    return <Status status="loading" message="Buscadando a tus artistas seguidos..." />;
  }

  if (isError) {
    return <Status status="error" message={error} />;
  }

  return data.length === 0 ? (
    <EmptySection message="No has seguido a ningún artista" />
  ) : (
    data.map((artist, index) => (
      <Box margin="10px 0" key={index}>
        <ArtistCard
          artistId={artist.id}
          amountOfFollowers={artist.followers}
          name={artist.bandName ? artist.bandName : artist.artisticName}
          avatar={getImage('artist', artist.avatar, 'default_avatar.jpeg')}
          isFollowed={true}
          badge={false}
          size="sm"
        />
      </Box>
    ))
  );
}

function Albums() {
  const { data, isLoading, isError, error } = useQuery('library-albums', getLikedAlbums);

  if (isLoading) {
    return <Status status="loading" message="Buscando tus albumes favoritos..." />;
  }

  if (isError) {
    return <Status status="error" message={error} />;
  }

  return data.length === 0 ? (
    <EmptySection message="No has marcado como favorito ni un album" />
  ) : (
    data.map((album, index) => (
      <Box margin="10px 0" key={index}>
        <SongCard
          key={index}
          id={album.id}
          name={album.name}
          type={album.releaseType}
          authors={album.artist.artisticName ? album.artist.artisticName : album.artist.bandName}
          cover={getImage('album', album.cover, 'default_album.jpg')}
          year={dayjs(album.year).format('YYYY')}
          isExplicit={false}
          isLiked={true}
        />
      </Box>
    ))
  );
}

function Playlists() {
  const { data, isLoading, isError, error } = useQuery('library-playlists', getLikedPlaylists);

  if (isLoading) {
    return <Status status="loading" message="Buscando tus playlists..." />;
  }

  if (isError) {
    return <Status status="error" message={error} />;
  }

  return data.playlists.length === 0 ? (
    <EmptySection message="No has creado o marcado como favorita ni una playlist" />
  ) : (
    data.playlists.map((playlist, index) => (
      <Box margin="10px 0" key={index}>
        <PlaylistCard
          id={playlist.id}
          key={index}
          name={playlist.name}
          likes={playlist.likes}
          author={playlist.username}
          cover={getImage('playlist', playlist.cover, 'default_cover.jpg')}
          amountOfSongs={0}
          badge={false}
          isLiked={true}
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

function EmptySection({ message }) {
  return (
    <Box textAlign="center" position="absolute" top="200px">
      <Heading fontSize="2xl">{message}</Heading>
      <Text color="whiteAlpha.700" marginTop="10px" fontSize="lg">
        ¿Porqué no lo intentas?
      </Text>
      <Text color="whiteAlpha.700" marginTop="10px">
        Presiona el botón que está arriba o visita la{' '}
        <Link to="/explore">página de exploración</Link> para empezar.
      </Text>
    </Box>
  );
}
