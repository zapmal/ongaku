import { SimpleGrid, Heading, Box, Divider, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { getLatestArtists } from '../api/artist';
import { getLatestSongs } from '../api/song';
import { SongRow, ArtistRow } from '../components';
import { POPULAR_TOPICS } from '../constants';

import { Footer } from '@/components/Core';
import { Highlight, Spinner } from '@/components/Utils';
import { getImage } from '@/utils/getImage';
import { getLink } from '@/utils/getLink';

export function Explore() {
  const {
    data: latestArtists,
    isLoading: isLoadingArtists,
    isError: isArtistsError,
  } = useQuery('latest-artists', getLatestArtists);

  const {
    data: latestSongs,
    isLoading: isLoadingSongs,
    isError: isSongsError,
  } = useQuery('latest-songs', getLatestSongs);

  if (isLoadingSongs || isLoadingArtists) {
    return <Spinner paddingBottom="20%" />;
  }

  if (isSongsError || isArtistsError) throw new Error();

  return (
    <Box>
      <SimpleGrid columns={2} align="center">
        <Box>
          <Heading fontSize="2xl">
            <Highlight>Nuevas</Highlight> Canciones
          </Heading>

          {latestSongs.length === 0 ? (
            <Box>
              <Text color="whiteAlpha.700" marginTop="20px">
                No hay canciones
              </Text>
            </Box>
          ) : (
            latestSongs.map((song, index) => (
              <Box key={index}>
                <SongRow
                  name={song.name}
                  cover={getImage('album', song.album.cover, 'default_album.png')}
                  isExplicit={song.isExplicit}
                  authors={
                    song.artist.artisticName ? song.artist.artisticName : song.artist.band.name
                  }
                  albumName={song.album.name}
                  albumId={song.album.id}
                  year={dayjs(song.album.year).format('YYYY')}
                  song={song}
                />
                <Divider width="75%" />
              </Box>
            ))
          )}
        </Box>

        <Box>
          <Heading fontSize="2xl">
            <Highlight>Nuevos</Highlight> Artistas
          </Heading>

          {latestArtists.length === 0 ? (
            <Box>
              <Text color="whiteAlpha.700" marginTop="20px">
                No hay artistas
              </Text>
            </Box>
          ) : (
            latestArtists.map((artist, index) => (
              <Box key={index}>
                <ArtistRow
                  id={artist.id}
                  name={artist.artisticName ? artist.artisticName : artist.band.name}
                  avatar={getImage('artist', artist.avatar, 'default_avatar.png')}
                  amountOfFollowers={
                    artist.artistMetrics?.followers ? artist.artistMetrics.followers : 0
                  }
                  badge={false}
                  isFollowed={artist.interaction.length !== 0 ? artist.interaction[0].value : false}
                  size="sm"
                />
                <Divider width="75%" />
              </Box>
            ))
          )}
        </Box>
      </SimpleGrid>

      <Heading fontSize="2xl" textAlign="center" margin="40px 0 10px 0">
        <Highlight>Tópicos</Highlight> recomendados para buscar
      </Heading>

      <Text color="whiteAlpha.800" textAlign="center" fontSize="sm">
        Haz click en uno de los tópicos para realizar la búsqueda.
      </Text>

      <SimpleGrid margin="20px 30px" spacing="20px" columns={5}>
        {POPULAR_TOPICS.map((topic, index) => {
          const randomNumber = Math.round(Math.random() * 5);
          return <Topic name={topic} key={index} color={COLORS[randomNumber]} />;
        })}
      </SimpleGrid>

      <Footer topMargin="25px" />
    </Box>
  );
}

const COLORS = ['green', 'yellow', 'red', 'blue', 'pink', 'purple'];

function Topic({ name, color }) {
  // eslint-disable-next-line no-unused-vars
  const [_, link] = getLink(name, name);

  return (
    <Box
      backgroundColor={`${color}.600`}
      width="100%"
      margin="5px"
      padding="10px 0"
      borderRadius="5px"
      textAlign="center"
      as={Link}
      fontWeight="bold"
      to={`/search?query=${link}`}
      transition="all 300ms ease-in"
      _hover={{
        backgroundColor: `${color}.500`,
      }}
      _active={{
        backgroundColor: `${color}.400`,
      }}
    >
      {name}
    </Box>
  );
}
