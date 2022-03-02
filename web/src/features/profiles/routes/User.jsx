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
  SimpleGrid,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { MdEdit, MdShare } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import { getProfileData } from '../api/user';
import { EditProfile } from '../components';
import { ROLES_SPANISH } from '../constants';

import { Footer } from '@/components/Core';
import { Banner, Button } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
import { ArtistCard, PlaylistCard, GRADIENTS } from '@/features/app';
import { theme } from '@/stitches.config.js';
import { getImage } from '@/utils/getImage';

const FLEX_PROPS = { margin: '20px 10px', justify: 'center' };

export function UserProfile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const params = useParams();
  const navigate = useNavigate();
  const [{ user, playlists, followed }, setUser] = useState({
    user: { userMetadata: {} },
    playlists: { playlists: [], likedPlaylists: [] },
    followed: [],
  });

  useEffect(() => {
    getProfileData(params.username)
      .then((response) => setUser(response))
      .catch((error) => {
        console.log(error);
        navigate('/not-found');
      });
  }, [navigate, params.username]);

  console.log(playlists);

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
                  {user.fullName} <Badge fontSize="md">{ROLES_SPANISH[user.role]}</Badge>
                </Heading>

                <Text fontWeight="bold" fontSize="lg">
                  {user.userMetadata.active ? 'Activo' : 'Inactivo'}
                  <Badge
                    backgroundColor={
                      user.userMetadata.active
                        ? theme.colors.successBorderHover.value
                        : theme.colors.dangerSolid.value
                    }
                    marginLeft="10px"
                    width="10px"
                    height="10px"
                    borderRadius="100%"
                  />
                </Text>

                <Text fontSize="lg" marginTop="5px">
                  Miembro desde hace {dayjs().from(user.userMetadata.createdAt, true)}
                </Text>

                <Flex marginTop="10px" align="center">
                  <Text fontWeight="bold" marginRight="20px">
                    <a href="#playlists">Playlists: </a>
                    <Highlight>{playlists.playlists.length}</Highlight>
                  </Text>

                  <Text fontWeight="bold">
                    <a href="#following">Siguiendo: </a> <Highlight>{followed.length}</Highlight>
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
            {followed.map(({ artist }, index) => (
              <ArtistCard
                key={index}
                name={artist.artisticName ? artist.artisticName : artist.band.name}
                avatar={getImage('artist', artist.avatar, 'default_avatar.jpeg')}
                amountOfFollowers={artist.artistMetrics.followers}
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
            {playlists.likedPlaylists.map((playlist, index) => (
              <PlaylistCard
                key={index}
                cover={getImage('playlist', playlist.userPlaylist.cover, 'default_cover.jpg')}
                name={playlist.userPlaylist.name}
                likes={playlist.userPlaylist.likes}
                amountOfSongs={0}
                author={playlist.user.username}
                badge={false}
              />
            ))}
          </Flex>

          <Heading marginTop="40px" id="playlists">
            <Highlight>Playlists</Highlight> propias
          </Heading>

          <SimpleGrid columns={5} gap="30px" marginTop="20px">
            {playlists.playlists.map((playlist, index) => (
              <PlaylistCard
                key={index}
                cover={getImage('playlist', playlist.cover, 'default_cover.jpg')}
                name={playlist.name}
                likes={playlist.likes}
                amountOfSongs={0}
                author={playlist.user.username}
                badge={false}
              />
            ))}
          </SimpleGrid>

          {/* <Text margin="20px 0">No hay nada aquí aún. ¡Vuelve luego!</Text> */}
        </Box>
        <Footer topMargin="40px" />
      </Box>
      {isOpen && <EditProfile isOpen={isOpen} onClose={onClose} />}
    </>
  );
}
