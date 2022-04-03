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
import React from 'react';
import { MdEdit, MdShare } from 'react-icons/md';
import { useQuery } from 'react-query';
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

export function UserProfile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const entity = useAuthStore((s) => s.entity);
  const params = useParams();
  const navigate = useNavigate();

  const {
    data: { user, playlists, followed },
    isLoading,
  } = useQuery(`profile-${params?.username}`, () => getProfileData(params?.username), {
    initialData: {
      user: { userMetadata: {} },
      playlists: { playlists: [], likedPlaylists: [] },
      followed: [],
    },
    onError: () => navigate('/not-found'),
  });

  if (isLoading) {
    return <Spinner paddingBottom="30%" />;
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
                  {(entity.id === user.id || entity.role === 'ADMIN') && (
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
          {followed.length === 0 ? (
            <Text margin="20px 0">No hay nada aquí aún. ¡Vuelve luego!</Text>
          ) : (
            <SimpleGrid columns={followed.length === 1 ? 1 : 5} gap="30px" marginTop="20px">
              {followed.map(({ artist }, index) => (
                <ArtistCard
                  key={index}
                  artistId={artist.id}
                  name={artist.artisticName ? artist.artisticName : artist.band.name}
                  avatar={getImage('artist', artist.avatar, 'default_avatar.png')}
                  amountOfFollowers={artist.artistMetrics.followers}
                  isHighlighted={index % 2 === 0}
                  badge={false}
                  isFollowed={artist.interaction.length !== 0 ? artist.interaction[0].value : false}
                  size="sm"
                />
              ))}
            </SimpleGrid>
          )}

          <Heading marginTop="40px">
            Playlists que le <Highlight>gustaron</Highlight>
          </Heading>
          {playlists.likedPlaylists.length === 0 ? (
            <Text margin="20px 0">No hay nada aquí aún. ¡Vuelve luego!</Text>
          ) : (
            <SimpleGrid columns={5} gap="30px" marginTop="20px">
              {console.log(playlists.likedPlaylists)}
              {playlists.likedPlaylists.map((playlist, index) => (
                <PlaylistCard
                  id={playlist.userPlaylistId}
                  key={index}
                  cover={getImage('playlist', playlist.userPlaylist.cover, 'default_cover.jpg')}
                  name={playlist.userPlaylist.name}
                  likes={playlist.userPlaylist.likes}
                  amountOfSongs={
                    playlist?.userPlaylist?.songsInPlaylist?.length
                      ? playlist.userPlaylist.songsInPlaylist.length
                      : 0
                  }
                  author={playlist.userPlaylist.user.username}
                  badge={false}
                  notLikeable={
                    playlist.userPlaylist.user.username === entity.username ||
                    entity.role === 'ARTIST'
                  }
                />
              ))}
            </SimpleGrid>
          )}

          <Heading marginTop="40px" id="playlists">
            <Highlight>Playlists</Highlight> propias
          </Heading>

          {playlists.playlists.length === 0 ? (
            <Text margin="20px 0">No hay nada aquí aún. ¡Vuelve luego!</Text>
          ) : (
            <SimpleGrid columns={5} gap="30px" marginTop="20px" textAlign="left">
              {playlists.playlists.map((playlist, index) => (
                <PlaylistCard
                  key={index}
                  id={playlist.id}
                  cover={getImage('playlist', playlist.cover, 'default_cover.jpg')}
                  name={playlist.name}
                  likes={playlist.likes}
                  amountOfSongs={
                    playlist?.songsInPlaylist.length ? playlist.songsInPlaylist.length : 0
                  }
                  author={playlist.user.username}
                  badge={false}
                  notLikeable={
                    playlist.user.username === entity.username || entity.role === 'ARTIST'
                  }
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
