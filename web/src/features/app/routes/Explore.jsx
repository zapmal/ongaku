import { SimpleGrid, Heading, Box, Divider } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

import { QueueSong, SmallArtistCard } from '../components';
import { NEW_ARTISTS, NEW_SONGS } from '../constants';

import { Highlight } from '@/components/Utils';
import { MUSIC_GENRES } from '@/features/auth';
import { getLink } from '@/utils/getLink';

export function Explore() {
  return (
    <Box>
      <SimpleGrid columns={2} align="center">
        <Box>
          <Heading fontSize="2xl">
            <Highlight>New</Highlight> Songs
          </Heading>

          {NEW_SONGS.map((song, index) => (
            <Box key={index}>
              <QueueSong
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
            <Highlight>New</Highlight> Artists
          </Heading>

          {NEW_ARTISTS.map((artist, index) => (
            <Box key={index}>
              <SmallArtistCard
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

      <Heading fontSize="2xl" textAlign="center" margin="40px 0">
        <Highlight>Hot</Highlight> Genres
        <SimpleGrid margin="20px" columns={Math.floor(MUSIC_GENRES.length / 2) - 2}>
          {MUSIC_GENRES.map((genre, index) => {
            const randomNumber = Math.round(Math.random() * 5);
            return <Genre name={genre.label} key={index} color={COLORS[randomNumber]} />;
          })}
        </SimpleGrid>
      </Heading>
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
      margin="10px"
      as={Link}
      to={`/search?genre=${link}`}
    >
      {name}
    </Box>
  );
}
