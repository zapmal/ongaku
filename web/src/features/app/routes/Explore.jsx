import { SimpleGrid, Heading, Box, Divider } from '@chakra-ui/react';
import React from 'react';

import { QueueSong } from '../components';
import { NEW_SONGS } from '../constants';

import { Highlight } from '@/components/Utils';

export function Explore() {
  return (
    <SimpleGrid columns={2} height="700px" align="center">
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
      </Box>
    </SimpleGrid>
  );
}
