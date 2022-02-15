import {
  Box,
  Flex,
  Image,
  SimpleGrid,
  Text,
  Divider,
  Spacer,
  IconButton as ChakraIconButton,
  Icon,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { AiOutlineHeart, AiOutlineDownload } from 'react-icons/ai';
import { FiChevronsUp } from 'react-icons/fi';
import {
  MdPlayArrow,
  MdRepeat,
  MdShuffle,
  MdVolumeUp,
  MdSkipPrevious,
  MdSkipNext,
} from 'react-icons/md';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { Link } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
import { theme } from '@/stitches.config.js';

const DIVIDER_PROPS = {
  orientation: 'vertical',
  h: '60px',
};
const SONG_DATA_PROPS = {
  fontSize: 'xs',
  color: 'whiteAlpha.800',
};

export function Player() {
  const { pathname } = useLocation();

  return (
    <Box sx={{ position: 'sticky', bottom: 0 }} zIndex={1} height="100px" overflow="hidden">
      <Flex
        align="center"
        bg={theme.colors.primaryBase.value}
        borderTop={`.5px solid ${theme.colors.primaryLine.value}`}
      >
        <Flex width="300px">
          {pathname !== '/queue' && (
            <Tooltip label="Click here to go to the queue">
              <Box as={RouterLink} to="/queue">
                <Image
                  src="/assets/images/static-queue-ztd.jpg"
                  width="100px"
                  height="100px"
                  _hover={{
                    cursor: 'pointer',
                  }}
                />
                <Icon
                  transition="all 300ms ease-in"
                  as={FiChevronsUp}
                  w="25px"
                  h="25px"
                  position="absolute"
                  left="70px"
                  top="5px"
                  _hover={{
                    color: theme.colors.accentSolidHover.value,
                    cursor: 'pointer',
                    transform: 'scale(1.2)',
                  }}
                />
              </Box>
            </Tooltip>
          )}
          <Flex flexFlow="column" justify="center" margin="0 10px" height="100px">
            <Box>
              <Text color={theme.colors.accentSolid.value} fontSize="sm" fontWeight="bold">
                Morphogenetic Sorrow
              </Text>

              <Text {...SONG_DATA_PROPS}>
                From:{' '}
                <Link variant="gray" to="/artist/shinji-hosoe" underline={false}>
                  Shinji Hosoe
                </Link>
              </Text>

              <Text {...SONG_DATA_PROPS}>
                Album: <Highlight>Zero Escape Official OST</Highlight>
              </Text>
            </Box>
          </Flex>

          <Spacer />

          <Divider {...DIVIDER_PROPS} margin="20px 2px" />
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

          <Flex align="center" height="25px">
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

            <Divider {...DIVIDER_PROPS} marginBottom="42px" />
          </Flex>
        </SimpleGrid>

        <Flex margin="0 auto" align="center" width="320px">
          <IconButton icon={AiOutlineDownload} size="md" marginLeft="15px" />
          <IconButton icon={AiOutlineHeart} size="md" marginRight="20px" />
          <Slider colorScheme="pink">
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Icon as={MdVolumeUp} w="20px" h="20px" color="whiteAlpha.800" margin="0 15px" />
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
          w={iconButtonSizes[size].w}
          h={iconButtonSizes[size].h}
          color="whiteAlpha.800"
          _hover={{
            color: 'whiteAlpha.700',
          }}
          _active={{
            color: theme.colors.accentSolidActive.value,
          }}
        />
      }
      _hover={{
        bg: 'transparent',
      }}
      _active={{
        bg: 'transparent',
      }}
      {...extraStyles}
    />
  );
}
