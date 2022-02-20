import {
  Box,
  Heading,
  Flex,
  Image,
  Text,
  Badge,
  Icon,
  ButtonGroup,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { MdEdit, MdShare } from 'react-icons/md';

import { EditProfile } from '../components';

import { Footer } from '@/components/Core';
import { Banner, Button } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
import {
  ArtistCard,
  PlaylistCard,
  ARTIST_SEARCH_RESULT as ARTISTS_IN_PROFILE,
  PLAYLISTS_SEARCH_RESULTS as PLAYLISTS_IN_PROFILE,
  GRADIENTS,
} from '@/features/app';
import { theme } from '@/stitches.config.js';

const FLEX_PROPS = { margin: '20px 10px', justify: 'center' };

export function UserProfile() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box>
        <Banner image="static-user-profile-banner.jpg" height="700px">
          <Flex bg={GRADIENTS.bottom} height="100%" justify="flex-start" align="self-end">
            <HStack>
              <Image
                marginLeft="40px"
                src="/assets/images/static-admin-avatar.jpeg"
                w="300px"
                h="300px"
                objectFit="cover"
                borderRadius="20px"
              />

              <Box paddingLeft="20px">
                <Heading fontSize="xxx-large">
                  Manuel Zapata{' '}
                  <Badge fontSize="md" color="white" bg={theme.colors.accentSolid.value}>
                    ADMIN
                  </Badge>
                </Heading>

                <Text fontWeight="bold" fontSize="lg">
                  Administrador - Activo
                  <Badge
                    backgroundColor={theme.colors.successBorderHover.value}
                    marginLeft="10px"
                    width="10px"
                    height="10px"
                    borderRadius="100%"
                  />
                </Text>

                <Text fontSize="lg" marginTop="5px">
                  Miembro desde hace mucho tiempo.
                </Text>

                <Flex marginTop="10px" align="center">
                  <Text fontWeight="bold" marginRight="20px">
                    <a href="#playlists">Playlists: </a>
                    <Highlight>0</Highlight>
                  </Text>

                  <Text fontWeight="bold">
                    <a href="#following">Siguiendo: </a> <Highlight>3</Highlight>
                  </Text>
                </Flex>
                <ButtonGroup gap="5px" margin="20px 0">
                  <Button onClick={onOpen} rightIcon={<Icon as={MdEdit} w="15px" h="15px" />}>
                    Editar Perfil
                  </Button>
                  <Button variant="accent" rightIcon={<Icon as={MdShare} w="15px" h="15px" />}>
                    Compartir Perfil
                  </Button>
                </ButtonGroup>
              </Box>
            </HStack>
          </Flex>
        </Banner>

        <Box margin="40px" textAlign="center">
          <Heading marginTop="10px" id="following">
            Artistas que sigue
          </Heading>
          <Flex {...FLEX_PROPS}>
            {ARTISTS_IN_PROFILE.map((artist, index) => (
              <ArtistCard
                key={index}
                name={artist.name}
                image={artist.image}
                amountOfFollowers={artist.amountOfFollowers}
                to={artist.to}
                isHighlighted={index % 2 === 0}
                badge={false}
                size="sm"
              />
            ))}
          </Flex>

          <Heading marginTop="40px">
            Playlists que le <Highlight>gustaron</Highlight>
          </Heading>
          <Flex {...FLEX_PROPS}>
            {PLAYLISTS_IN_PROFILE.map((playlist, index) => (
              <PlaylistCard
                key={index}
                cover={playlist.cover}
                name={playlist.name}
                likes={playlist.likes}
                amountOfSongs={playlist.amountOfSongs}
                author={playlist.author}
                badge={false}
              />
            ))}
          </Flex>

          <Heading marginTop="40px" id="playlists">
            <Highlight>Playlists</Highlight> propias
          </Heading>

          <Text margin="20px 0">No hay nada aquí aún. ¡Vuelve luego!</Text>
        </Box>
        <Footer topMargin="40px" />
      </Box>
      {isOpen && <EditProfile isOpen={isOpen} onClose={onClose} />}
    </>
  );
}
