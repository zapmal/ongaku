import { SimpleGrid, Heading, Box, Divider, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

import { SongRow, ArtistRow } from '../components';
import { NEW_ARTISTS, NEW_SONGS, POPULAR_TOPICS } from '../constants';

import { Footer } from '@/components/Core';
import { Highlight } from '@/components/Utils';
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
                avatar={artist.image}
                amountOfFollowers={artist.amountOfFollowers}
                badge={false}
                size="sm"
              />
              <Divider width="75%" />
            </Box>
          ))}
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
