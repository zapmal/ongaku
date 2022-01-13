import {
  Box,
  Flex,
  Image,
  SimpleGrid,
  Text,
  Divider,
  Spacer,
  ChakraIconButton,
  Icon,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import React from 'react';
// import { IoMdHeartEmpty, IoMdDownload } from 'react-icons/io';
import { AiOutlineHeart, AiOutlineDownload } from 'react-icons/ai';
import {
  MdPlayArrow,
  MdRepeat,
  MdShuffle,
  MdVolumeUp,
  MdSkipPrevious,
  MdSkipNext,
} from 'react-icons/md';

import { Highlight } from '@/components/Utils';
import { theme } from '@/stitches.config.js';

const DIVIDER_PROPS = {
  orientation: 'vertical',
  h: '60px',
};
const SONG_DATA_PROPS = {
  fontSize: 'sm',
  color: 'whiteAlpha.800',
};

export function Player() {
  return (
    <Box sx={{ position: 'sticky', bottom: 0 }} zIndex={1} height="80px" overflow="hidden">
      <Flex
        align="center"
        bg={theme.colors.primaryBase.value}
        borderTop={`.5px solid ${theme.colors.primaryLine.value}`}
      >
        <Flex width="300px">
          <Image src="/assets/images/static-current-song-perfect-world.jpeg" width="80px" />
          <Flex flexFlow="column" justify="center" marginLeft="20px">
            <Highlight>Perfect World</Highlight>

            <Text {...SONG_DATA_PROPS}>
              From <Highlight variant="gray">TWICE</Highlight>
            </Text>
            <Text {...SONG_DATA_PROPS}>
              Album: <Highlight>Perfect World</Highlight>
            </Text>
          </Flex>

          <Spacer />

          <Divider {...DIVIDER_PROPS} marginTop="10px" />
        </Flex>

        <SimpleGrid width="700px">
          <Flex justify="center" marginBottom="5px">
            <IconButton icon={MdShuffle} size="sm" />
            <IconButton icon={MdSkipPrevious} size="md" marginLeft="5px" />

            <ChakraIconButton
              bg="whiteAlpha.900"
              borderRadius="50%"
              marginLeft="5px"
              marginRight="5px"
              icon={
                <Icon as={MdPlayArrow} w="30px" h="30px" color={theme.colors.primaryBase.value} />
              }
            />

            <IconButton icon={MdSkipNext} size="md" marginRight="5px" />
            <IconButton icon={MdRepeat} size="sm" />
          </Flex>

          <Flex align="center" height="20px">
            <Spacer />

            <Text marginRight="10px" fontSize="sm">
              0:00
            </Text>

            <Slider colorScheme="pink" width="450px">
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Text marginLeft="10px" fontSize="sm">
              3:40
            </Text>

            <Spacer />

            <Divider {...DIVIDER_PROPS} marginBottom="40px" />
          </Flex>
        </SimpleGrid>

        <IconButton icon={AiOutlineDownload} size="md" marginLeft="20px" />
        <IconButton icon={AiOutlineHeart} size="md" />

        <ChakraIconButton variant="ghost" icon={<Icon as={AiOutlineHeart} w="25px" h="25px" />} />

        <Flex margin="0 auto" align="center" width="200px">
          <Slider colorScheme="pink">
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Icon as={MdVolumeUp} w="20px" h="20px" color="whiteAlpha.800" marginLeft="10px" />
        </Flex>
      </Flex>
    </Box>
  );
}

const iconButtonSizes = {
  sm: {
    w: '20px',
    h: '20px',
  },
  md: {
    w: '25px',
    h: '25px',
  },
};

function IconButton({ icon, size, ...extraStyles }) {
  return (
    <ChakraIconButton
      variant="ghost"
      icon={
        <Icon
          as={icon}
          w={iconButtonSizes[size]}
          h={iconButtonSizes[size]}
          color="whiteAlpha.800"
        />
      }
      {...extraStyles}
    />
  );
}
