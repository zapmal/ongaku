import { SimpleGrid, Image, Box, Text, Divider } from '@chakra-ui/react';
import React from 'react';

import { SongInQueue } from '../components';
import { SONGS_IN_QUEUE } from '../constants';

import { Highlight } from '@/components/Utils';

export function Queue() {
  return (
    <>
      <SimpleGrid columns={2} align="space-evenly" position="relative" margin="20px 50px">
        <Box width="550px">
          <Image
            src="/assets/images/static-arknights-race.jpeg"
            width="inherit"
            height="400px"
            borderRadius="5px"
            sx={{ position: 'fixed', top: 20 }}
          />
          <Text
            position="fixed"
            bottom="120px"
            left="290px"
            color="whiteAlpha.700"
            fontWeight="bold"
          >
            Portada
          </Text>
        </Box>

        <Box>
          <Text color="whiteAlpha.700" marginBottom="10px">
            <Highlight>Cola</Highlight> · 10 canciones · 37 min 45 seg
          </Text>
          <Divider />

          {SONGS_IN_QUEUE.map((song, index) => (
            <div key={index}>
              <SongInQueue
                name={song.name}
                authors={song.authors}
                duration={song.duration}
                itemNumber={index + 1}
                isPlaying={index === 0}
                isExplicit={song.isExplicit}
              />

              {SONGS_IN_QUEUE.length !== index + 1 && <Divider />}
            </div>
          ))}
        </Box>
      </SimpleGrid>
    </>
  );
}
