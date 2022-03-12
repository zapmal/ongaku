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
import { MdShare, MdPause, MdDelete } from 'react-icons/md';

import { Footer } from '@/components/Core';
import { Banner, Link } from '@/components/Elements';
import { NEW_SONGS, OptionMenu } from '@/features/app';
import { theme } from '@/stitches.config.js';
import { copyURL } from '@/utils/copyURL';
import { getImage } from '@/utils/getImage';
import { getLink } from '@/utils/getLink';

const BUTTON_PROPS = {
  variant: 'outline',
  borderRadius: '5px',
  _hover: {
    bg: theme.colors.accentSolidHover.value,
    borderColor: 'transparent',
  },
  _active: {
    bg: theme.colors.accentSolidActive.value,
    borderColor: 'transparent',
  },
};

const TABLE_ROW_PROPS = {
  color: 'whiteAlpha.700',
  fontSize: 'sm',
};

export function View() {
  return (
    <Box>
      <Banner
        image={getImage('view', null, 'default/default.svg')}
        backgroundColor={theme.colors.primaryBg.value}
        height="100%"
        bgRepeat="no-repeat"
        bgPosition="right"
      >
        <Flex
          align="flex-end"
          justify="flex-start"
          height="400px"
          bg={`linear-gradient(0, ${theme.colors.primaryBase.value} 5%, rgba(255,255,255,0) 40%)`}
        >
          <SimpleGrid margin="20px">
            <Heading fontSize="xxx-large" letterSpacing="2px">
              <HStack fontSize="sm" letterSpacing="initial">
                <Avatar src="/assets/images/static-user-1.png" />
                <Link to="/user/verox" underline={false} fontWeight="bold">
                  Verox
                </Link>
              </HStack>
              Gaming
            </Heading>

            <HStack color="whiteAlpha.800" marginTop="5px">
              <Text fontWeight="bold">PLAYLIST</Text>
              <Text>
                {' - '}33 canciones {' - '}
              </Text>
              {/* <Text>7 hr 33 min {' - '}</Text>
              <Text>42 likes</Text> */}
            </HStack>

            <HStack marginTop="30px">
              {/* <IconButton
                bg="whiteAlpha.900"
                borderRadius="50%"
                w="70px"
                h="70px"
                backgroundColor={theme.colors.accentSolid.value}
                icon={<Icon as={MdPlayArrow} w="50px" h="50px" color="whiteAlpha.900" />}
                _hover={{ backgroundColor: theme.colors.accentSolidHover.value }}
                _active={{ backgroundColor: theme.colors.accentSolidActive.value }}
              /> */}
              {/* <Button {...BUTTON_PROPS} rightIcon={<Icon as={AiOutlineHeart} w="25px" h="25px" />}>
                Like
              </Button> */}
              <Button
                variant="outline"
                borderColor={theme.colors.dangerSolid.value}
                color={theme.colors.dangerSolid.value}
                _hover={{
                  backgroundColor: theme.colors.dangerSolidHover.value,
                  color: '#ffffff',
                }}
                rightIcon={<Icon as={MdDelete} w="20px" h="20px" />}
              >
                Borrar
              </Button>
              <Button
                // onClick={() => copyURL(`view/${data.name}`)}
                onClick={() => copyURL(`view/`)}
                {...BUTTON_PROPS}
                rightIcon={<Icon as={MdShare} w="20px" h="20px" />}
              >
                Compartir
              </Button>
            </HStack>
          </SimpleGrid>
        </Flex>
      </Banner>
      <Table variant="unstyled">
        <Thead color={theme.colors.accentText.value}>
          <Tr>
            <Th>#</Th>
            <Th>Portada</Th>
            <Th>Nombre</Th>
            <Th>Autor(es)</Th>
            <Th>Album</Th>
            <Th>Duración</Th>
            <Th>Opciones</Th>
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
