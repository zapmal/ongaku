import {
  Box,
  Image,
  IconButton,
  Button,
  Avatar,
  SimpleGrid,
  HStack,
  Heading,
  Flex,
  Text,
  Icon,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
} from '@chakra-ui/react';
import React from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { MdShare, MdPlayArrow, MdPause } from 'react-icons/md';

import { Footer } from '@/components/Core';
import { Banner, Link } from '@/components/Elements';
import { GRADIENTS, NEW_SONGS, OptionMenu } from '@/features/app';
import { theme } from '@/stitches.config.js';
import { getLink } from '@/utils/getLink';

const BUTTON_PROPS = {
  variant: 'outline',
  borderRadius: '5px',
  _hover: { bg: theme.colors.accentSolidHover.value },
  _active: { bg: theme.colors.accentSolidActive.value },
};

const TABLE_ROW_PROPS = {
  color: 'whiteAlpha.700',
  fontSize: 'sm',
};

export function View() {
  return (
    <Box>
      <Banner image="static-background-image-view.png" height="100%" bgRepeat="cover">
        <Flex align="flex-end" justify="flex-start" height="400px" bg={GRADIENTS.bottom}>
          <SimpleGrid margin="20px">
            <Heading fontSize="xxx-large" letterSpacing="4px">
              <Text fontSize="sm" fontWeight="bold" letterSpacing="2px">
                PLAYLIST
              </Text>
              Gaming
              <IconButton
                bg="whiteAlpha.900"
                borderRadius="50%"
                marginLeft="10px"
                w="70px"
                h="70px"
                backgroundColor={theme.colors.accentSolid.value}
                icon={<Icon as={MdPlayArrow} w="50px" h="50px" color="whiteAlpha.900" />}
                _hover={{ backgroundColor: theme.colors.accentSolidHover.value }}
                _active={{ backgroundColor: theme.colors.accentSolidActive.value }}
              />
            </Heading>

            <HStack color="whiteAlpha.800" marginTop="5px">
              <Avatar src="/assets/images/static-user-1.png" />
              <Link to="/user/verox" underline={false} fontWeight="bold">
                Verox
              </Link>
              <Text>
                {' - '} 33 songs {' - '}
              </Text>
              <Text>7 hr 33 min {' - '}</Text>
              <Text>42 likes</Text>
            </HStack>
            <HStack marginTop="15px">
              <Button {...BUTTON_PROPS} rightIcon={<Icon as={AiOutlineHeart} w="25px" h="25px" />}>
                Like
              </Button>
              <Button {...BUTTON_PROPS} rightIcon={<Icon as={MdShare} w="20px" h="20px" />}>
                Share
              </Button>
            </HStack>
          </SimpleGrid>
        </Flex>
      </Banner>
      <Table variant="unstyled">
        <Thead color={theme.colors.accentText.value}>
          <Tr>
            <Th>#</Th>
            <Th>Cover</Th>
            <Th>Name</Th>
            <Th>Author(s)</Th>
            <Th>Album</Th>
            <Th>Duration</Th>
            <Th>Options</Th>
          </Tr>
        </Thead>
        <Tbody>
          {NEW_SONGS.map((song, index) => {
            // eslint-disable-next-line no-unused-vars
            const [_, albumLink] = getLink(song.albumName, song.albumName);

            return (
              <Tr key={index} {...TABLE_ROW_PROPS}>
                <Td>
                  {/* This should be "isPlaying?" */}
                  {index === 0 ? (
                    <Icon
                      as={MdPause}
                      w="25px"
                      h="25px"
                      color="whiteAlpha.900"
                      _hover={{ cursor: 'pointer' }}
                    />
                  ) : (
                    index + 1
                  )}
                </Td>
                <Td>
                  <Image src={song.cover} w="50px" h="50px" borderRadius="5px" />
                </Td>
                <Td>{song.name}</Td>
                <Td>
                  {song.authors.split(',').map((author, index) => {
                    const [linkText, authorLink] = getLink(author, song.authors);
                    return (
                      <Link
                        to={`/artist/${authorLink}`}
                        key={index}
                        underline={false}
                        variant="gray"
                      >
                        {linkText}
                      </Link>
                    );
                  })}
                </Td>
                <Td>
                  <Link to={`/view/${albumLink}`} underline={false} variant="gray">
                    {song.albumName}
                  </Link>
                </Td>
                <Td>{song.duration}</Td>
                <Td>
                  <IconButton
                    icon={<Icon as={AiOutlineHeart} w="25px" h="25px" />}
                    variant="ghost"
                    _hover={{ backgroundColor: 'transparent' }}
                    _active={{ color: theme.colors.accentSolid.value }}
                  />
                  <OptionMenu isLarge={true} />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      <Footer topMargin="40px" />
    </Box>
  );
}
