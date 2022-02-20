import { SimpleGrid, Heading, Box, Divider, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

import { SongRow, ArtistRow } from '../components';
import { NEW_ARTISTS, NEW_SONGS } from '../constants';

import { Footer } from '@/components/Core';
import { Highlight } from '@/components/Utils';
import { MUSIC_GENRES } from '@/features/auth';
import { getLink } from '@/utils/getLink';

export function Explore() {
  return (
    <Box>
      <SimpleGrid columns={2} align="center">
        <Box>
          <Heading fontSize="2xl">
            <Highlight>Nuevas</Highlight> Canciones
          </Heading>

          {NEW_SONGS.map((song, index) => (
            <Box key={index}>
              <SongRow
                name={song.name}
                cover={song.cover}
                isExplicit={song.isExplicit}
                authors={song.authors}
                albumName={song.albumName}
                year={song.year}
                duration={song.duration}
              />
              <Divider width="75%" />
            </Box>
          ))}
        </Box>

        <Box>
          <Heading fontSize="2xl">
            <Highlight>Nuevos</Highlight> Artistas
          </Heading>

          {NEW_ARTISTS.map((artist, index) => (
            <Box key={index}>
              <ArtistRow
                name={artist.name}
                image={artist.image}
                amountOfFollowers={artist.amountOfFollowers}
                to={artist.to}
                badge={false}
                size="sm"
              />
              <Divider width="75%" />
            </Box>
          ))}
        </Box>
      </SimpleGrid>

      <Heading fontSize="2xl" textAlign="center" margin="40px 0 10px 0">
        <Highlight>Géneros</Highlight> para buscar canciones
      </Heading>

      <Text color="whiteAlpha.800" textAlign="center" fontSize="sm">
        Haz click en uno de los géneros para filtrar canciones que se adapten a tu estilo único.
      </Text>

      <SimpleGrid margin="0 20px 30px 20px" columns={Math.floor(MUSIC_GENRES.length / 2) - 2}>
        {MUSIC_GENRES.map((genre, index) => {
          const randomNumber = Math.round(Math.random() * 5);
          return <Genre name={genre.label} key={index} color={COLORS[randomNumber]} />;
        })}
      </SimpleGrid>

      <Footer topMargin="25px" />
    </Box>
  );
}

const COLORS = ['green', 'yellow', 'red', 'blue', 'pink', 'purple'];

function Genre({ name, color }) {
  // eslint-disable-next-line no-unused-vars
  const [_, link] = getLink(name, name);

  return (
    <Box
      backgroundColor={`${color}.600`}
      height="65px"
      width="140px"
      paddingTop="20px"
      borderRadius="5px"
      fontSize="lg"
      textAlign="center"
      margin="15px 10px"
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
