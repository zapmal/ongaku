import { SimpleGrid, Image, Box, Text, Divider } from '@chakra-ui/react';
import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoMdMicrophone } from 'react-icons/io';

import { Option, OptionMenu, SongInQueue } from '../components';
import { SONGS_IN_QUEUE } from '../constants';

import { Highlight } from '@/components/Utils';

export function Queue() {
  return (
    <>
      <SimpleGrid columns={2} align="space-evenly" position="relative" margin="20px 50px">
        <Box width="550px">
          <Image
            src="/assets/images/static-queue-ztd.jpg"
            width="inherit"
            height="400px"
            borderRadius="5px"
            sx={{ position: 'fixed', top: 20 }}
          />
          <Box margin="10px" position="fixed" bottom="100px" left="210px">
            <Option
              icon={AiOutlinePlus}
              isLarge={true}
              label="Add to playlist"
              marginRight="40px"
            />
            <Option icon={IoMdMicrophone} isLarge={true} label="Show Lyrics" marginRight="40px" />
            <OptionMenu isLarge={true} />
          </Box>
        </Box>

        <Box>
          <Text color="whiteAlpha.700" marginBottom="10px">
            <Highlight>Queue</Highlight> · 10 songs · 37 min 45 sec
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
