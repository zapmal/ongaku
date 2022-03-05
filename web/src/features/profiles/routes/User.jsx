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
import { Highlight, Spinner } from '@/components/Utils';
import { ArtistCard, PlaylistCard } from '@/features/app';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';
import { copyURL } from '@/utils/copyURL';
import { getImage } from '@/utils/getImage';

const FLEX_PROPS = { margin: '20px 10px', justify: 'center' };

export function UserProfile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const entity = useAuthStore((s) => s.entity);
  const params = useParams();
  const navigate = useNavigate();
  const [{ user, playlists, followed, isLoading }, setUser] = useState({
    user: { userMetadata: {} },
    playlists: { playlists: [], likedPlaylists: [] },
    followed: [],
    isLoading: true,
  });

  useEffect(() => {
    getProfileData(params.username)
      .then((response) => setUser({ isLoading: false, ...response }))
      .catch((error) => {
        console.log(error);
        setUser((data) => ({ ...data, isLoading: false }));
        navigate('/not-found');
      });
  }, [navigate, params.username]);

  console.log(user);

  if (isLoading) {
    return <Spinner paddingBottom="100%" />;
  }

  return (
    <>
      <Box>
        <Banner image={getImage('user', user.background, 'default_background.svg')} height="500px">
          <Flex
            bg={`linear-gradient(0, ${theme.colors.primaryBase.value} 5%, rgba(255, 255, 255, .1) 60%)`}
            height="100%"
            justify="flex-start"
            align="self-end"
          >
            <HStack>
              <Image
                marginLeft="40px"
                src={getImage('user', user.avatar, 'default_avatar.svg')}
                w="300px"
                h="300px"
                objectFit="cover"
                borderRadius="20px"
              />

              <Box paddingLeft="20px">
                <Heading fontSize="xxx-large">
                  {user.fullName}{' '}
                  {entity.id === user.id && <Badge fontSize="md">{ROLES_SPANISH[user.role]}</Badge>}
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
                  {entity.id === user.id && (
                    <Button onClick={onOpen} rightIcon={<Icon as={MdEdit} w="15px" h="15px" />}>
                      Editar Perfil
                    </Button>
                  )}
                  <Button
                    onClick={() => copyURL(`user/${user.username}`)}
                    variant="accent"
                    rightIcon={<Icon as={MdShare} w="15px" h="15px" />}
                  >
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
            {followed.length === 0 ? (
              <Text margin="20px 0">No hay nada aquí aún. ¡Vuelve luego!</Text>
            ) : (
              followed.map(({ artist }, index) => (
                <ArtistCard
                  key={index}
                  artistId={artist.id}
                  name={artist.artisticName ? artist.artisticName : artist.band.name}
                  avatar={getImage('artist', artist.avatar, 'default_avatar.png')}
                  amountOfFollowers={artist.artistMetrics.followers}
                  isHighlighted={index % 2 === 0}
                  badge={false}
                  isFollowed={entity.username === user.username}
                  size="sm"
                />
              ))
            )}
          </Flex>

          <Heading marginTop="40px">
            Playlists que le <Highlight>gustaron</Highlight>
          </Heading>
          <Flex {...FLEX_PROPS}>
            {playlists.likedPlaylists.length === 0 ? (
              <Text margin="20px 0">No hay nada aquí aún. ¡Vuelve luego!</Text>
            ) : (
              playlists.likedPlaylists.map((playlist, index) => (
                <PlaylistCard
                  id={playlist.userPlaylistId}
                  key={index}
                  cover={getImage('playlist', playlist.userPlaylist.cover, 'default_cover.jpg')}
                  name={playlist.userPlaylist.name}
                  likes={playlist.userPlaylist.likes}
                  amountOfSongs={0}
                  author={playlist.user.username}
                  badge={false}
                  notLikeable={playlist.user.username === entity.username}
                />
              ))
            )}
          </Flex>

          <Heading marginTop="40px" id="playlists">
            <Highlight>Playlists</Highlight> propias
          </Heading>

          {playlists.playlists.length === 0 ? (
            <Text margin="20px 0">No hay nada aquí aún. ¡Vuelve luego!</Text>
          ) : (
            <SimpleGrid columns={5} gap="30px" marginTop="20px">
              {playlists.playlists.map((playlist, index) => (
                <PlaylistCard
                  key={index}
                  id={playlist.id}
                  cover={getImage('playlist', playlist.cover, 'default_cover.jpg')}
                  name={playlist.name}
                  likes={playlist.likes}
                  amountOfSongs={0}
                  author={playlist.user.username}
                  badge={false}
                  notLikeable={playlist.user.username === user.username}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>
        <Footer topMargin="40px" />
      </Box>
      {isOpen && (
        <EditProfile
          isOpen={isOpen}
          onClose={onClose}
          id={user.id}
          fullName={user.fullName}
          email={user.email}
          username={user.username}
        />
      )}
    </>
  );
}
