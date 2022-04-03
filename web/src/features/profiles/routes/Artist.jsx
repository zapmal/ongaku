import {
  Box,
  Button as ChakraButton,
  Divider,
  SimpleGrid,
  VStack,
  HStack,
  Heading,
  Flex,
  Text,
  Icon,
  Link,
  useDisclosure,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { MdAdd, MdShare, MdEdit, MdCheck } from 'react-icons/md';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { getFollowedArtists, followArtist } from '../../app/api/artist';
import { getProfileData } from '../api/artist';
import { EditArtistProfile } from '../components';

import { Footer } from '@/components/Core';
import { Banner } from '@/components/Elements';
import { Spinner, Highlight } from '@/components/Utils';
import { SongRow, SongCard, ArtistRow } from '@/features/app';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { capitalizeEach } from '@/utils/capitalizeEach';
import { copyURL } from '@/utils/copyURL';
import { getImage } from '@/utils/getImage';
import { getName } from '@/utils/getName';

const HIGHLIGHT_PROPS = {
  fontSize: 'lg',
  fontWeight: 'bold',
  color: theme.colors.accentText.value,
};
const TEXT_PROPS = {
  color: 'whiteAlpha.700',
  fontWeight: 'normal',
  fontSize: 'lg',
};
const BUTTON_PROPS = {
  variant: 'outline',
  borderRadius: '5px',
  _hover: { bg: theme.colors.accentSolidHover.value, borderColor: 'transparent' },
  _active: { bg: theme.colors.accentSolidActive.value },
};

export function ArtistProfile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const entity = useAuthStore((s) => s.entity);
  const params = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const {
    data: { artist, latestSongs, recommendation, albums },
    isLoading: isLoadingProfile,
  } = useQuery(`artist-${params?.name}`, () => getProfileData(params?.name), {
    initialData: {
      artist: {},
      latestSongs: [],
      recommendation: [],
      albums: [],
    },
    onError: () => {
      navigate('/not-found');
    },
  });
  const addNotification = useNotificationStore((s) => s.addNotification);

  const { data: followedArtists, isLoading: isLoadingFollowedArtists } = useQuery(
    'library-artists',
    getFollowedArtists,
    {
      initialData: [],
    }
  );
  const mutation = useMutation(followArtist, {
    onSuccess: () => {
      queryClient.invalidateQueries('library-artists');
      queryClient.invalidateQueries(`artist-${params?.name}`);
    },
  });

  const handleOnClick = async () => {
    try {
      await mutation.mutateAsync({ artistId: artist.id });
    } catch (error) {
      addNotification({
        title: 'Error',
        status: 'error',
        message: error,
      });
    }
  };

  if (isLoadingProfile && isLoadingFollowedArtists) {
    return <Spinner paddingBottom="30%" />;
  }

  return (
    <>
      <Box>
        <Banner
          image={getImage('artist', artist.artistInformation?.coverImage, 'default_cover.svg')}
          bgRepeat={
            artist.artistInformation?.coverImage &&
            navigator.userAgent.toLowerCase().indexOf('firefox') > -1
              ? 'round'
              : 'no-repeat'
          }
          bgPosition="top"
          height="700px"
        >
          <Flex
            align="center"
            justify="center"
            height="100%"
            bg={
              artist.artistInformation?.coverImage
                ? `linear-gradient(0, ${theme.colors.primaryBase.value} 5%, rgba(255,255,255,0) 40%)`
                : `linear-gradient(0, ${theme.colors.primaryBase.value} 5%, rgba(255, 255, 255, 0) 40%)`
            }
          >
            <VStack marginTop="150px">
              <Heading fontSize="xxx-large" textAlign="center">
                {artist.artisticName && capitalizeEach(getName(artist.artisticName))}
                {artist.band?.name && capitalizeEach(getName(artist.band?.name))}
                <br />
                {getFlagEmoji(artist.country)}
              </Heading>
              <Text fontWeight="bold" fontSize="lg">
                {artist.artistMetrics?.followers}{' '}
                {artist.artistMetrics?.followers === 1 ? 'seguidor' : 'seguidores'}
              </Text>
              {artist.artistInformation?.officialWebsite &&
                artist.artistInformation?.officialWebsite !== 'null' && (
                  <HStack fontWeight="bold" fontSize="lg">
                    <Link isExternal href={artist.artistInformation.officialWebsite}>
                      SITIO WEB OFICIAL
                    </Link>
                    <Icon as={FiExternalLink} w="20px" h="20px" />
                  </HStack>
                )}
              <HStack>
                {(entity.role === 'ADMIN' ||
                  (entity.role === 'ARTIST' && entity.id === artist.id)) && (
                  <ChakraButton {...BUTTON_PROPS} rightIcon={<Icon as={MdEdit} />} onClick={onOpen}>
                    Editar Perfil
                  </ChakraButton>
                )}
                {entity.role !== 'ARTIST' &&
                  (followedArtists?.filter((followed) => followed.id === artist.id).length === 1 ? (
                    <ChakraButton
                      {...BUTTON_PROPS}
                      rightIcon={<Icon as={MdCheck} w="25px" h="25px" />}
                      onClick={handleOnClick}
                      isDisabled={mutation.isLoading}
                    >
                      Siguiendo
                    </ChakraButton>
                  ) : (
                    <ChakraButton
                      {...BUTTON_PROPS}
                      rightIcon={<Icon as={MdAdd} w="25px" h="25px" />}
                      onClick={handleOnClick}
                      isDisabled={mutation.isLoading}
                    >
                      Seguir
                    </ChakraButton>
                  ))}

                <ChakraButton
                  onClick={() =>
                    copyURL(
                      `artist/${artist.artisticName ? artist.artisticName : artist.band.name}`
                    )
                  }
                  {...BUTTON_PROPS}
                  rightIcon={<Icon as={MdShare} w="20px" h="20px" />}
                >
                  Compartir
                </ChakraButton>
              </HStack>
            </VStack>
          </Flex>
        </Banner>

        <SimpleGrid columns={recommendation.length === 0 ? 1 : 2} align="center">
          <Box>
            <Heading fontSize="xx-large">Canciones Nuevas</Heading>
            {latestSongs.length === 0 ? (
              <Text fontSize="large" color="whiteAlpha.700" marginTop="10px">
                Este artista no tiene canciones nuevas, por ahora.
              </Text>
            ) : (
              latestSongs.map((song, index) => (
                <Box key={index}>
                  <SongRow
                    name={song.name}
                    cover={getImage('album', song.album.cover, 'default_album.png')}
                    isExplicit={song.isExplicit}
                    authors={
                      song.artist.artisticName ? song.artist.artisticName : song.artist.band.name
                    }
                    albumName={song.album.name}
                    albumId={song.album.id}
                    year={dayjs(song.album.year).format('YYYY')}
                    song={song}
                    width="90%"
                  />
                  <Divider width="90%" />
                </Box>
              ))
            )}
          </Box>
          {recommendation.length !== 0 && (
            <Box>
              <Heading fontSize="xx-large">A los fans también les gusta</Heading>
              {recommendation.map((artist, index) => (
                <Box key={index}>
                  <ArtistRow
                    id={artist.id}
                    name={artist.artisticName ? artist.artisticName : artist.band.name}
                    avatar={getImage('artist', artist.avatar, 'default_avatar.png')}
                    amountOfFollowers={
                      artist.artistMetrics?.followers ? artist.artistMetrics.followers : 0
                    }
                    badge={false}
                    isFollowed={
                      artist.interaction.length !== 0 ? artist.interaction[0].value : false
                    }
                    size="sm"
                  />
                  <Divider width="75%" />
                </Box>
              ))}
            </Box>
          )}
        </SimpleGrid>

        <Box margin="40px 0">
          <Heading fontSize="xx-large" textAlign="center">
            Albumes, Singles y EPs
          </Heading>
          {albums.length === 0 ? (
            <Text fontSize="large" color="whiteAlpha.700" marginTop="10px" textAlign="center">
              Este artista no ha publicado nada, por ahora.
            </Text>
          ) : (
            <Flex justify="center">
              {albums.map((entry, index) => (
                <Box margin="30px 0" key={index}>
                  <SongCard
                    id={entry.id}
                    cover={getImage('album', entry.cover, 'default_album.png')}
                    name={entry.name}
                    isExplicit={false}
                    type={entry.releaseType}
                    authors={
                      entry.artist.length
                        ? entry.artist
                            .map((a) =>
                              a.artisticName ? getName(a.artisticName) : getName(a.band.name)
                            )
                            .toString()
                        : entry.artist.artisticName
                        ? getName(entry.artist.artisticName)
                        : getName(entry.artist.band.name)
                    }
                    year={dayjs(entry.year).format('YYYY')}
                    notLikeable={entity.role === 'ARTIST'}
                  />
                </Box>
              ))}
            </Flex>
          )}
        </Box>

        <Box align="center" margin="0 30px" color="whiteAlpha.700">
          <Heading fontSize="xx-large" color="white" margin="10px 0">
            Acerca de{' '}
            <Highlight>
              {artist.artisticName && capitalizeEach(getName(artist.artisticName))}
              {artist.band?.name && capitalizeEach(getName(artist.band?.name))}
            </Highlight>
          </Heading>
          {artist.artistInformation?.biography ? (
            <Text width="80%">{artist.artistInformation?.biography}</Text>
          ) : (
            <Text fontSize="large">Este artista no ha subido su biografía.</Text>
          )}

          <Box marginTop="20px">
            <Text {...HIGHLIGHT_PROPS}>Géneros: </Text>
            <Text {...TEXT_PROPS}>
              {artist.genres?.map((genre, index) => {
                const displayGenre = genre.toUpperCase();
                return artist.genres.length !== index + 1 ? `${displayGenre}, ` : displayGenre;
              })}
            </Text>

            {artist.band?.members && (
              <>
                <Text {...HIGHLIGHT_PROPS} marginTop="10px">
                  Miembros:
                </Text>
                <Text {...TEXT_PROPS}>
                  {artist.band?.members.map((member, index) => {
                    return artist.band.members.length !== index + 1 ? `${member}, ` : member;
                  })}
                </Text>
              </>
            )}

            <Text {...HIGHLIGHT_PROPS} marginTop="10px">
              Discográfica(s):
            </Text>
            <Text {...TEXT_PROPS}>
              {artist.labels?.map((label, index) => {
                return artist.labels.length !== index + 1 ? `${label}, ` : label;
              })}
            </Text>

            <Text {...HIGHLIGHT_PROPS} marginTop="10px">
              Años Activo(s):
            </Text>
            <Text {...TEXT_PROPS}>{artist.yearsActive}</Text>
          </Box>
        </Box>

        <Footer topMargin="40px" />
      </Box>
      {isOpen && (
        <EditArtistProfile
          isOpen={isOpen}
          onClose={onClose}
          id={artist.id}
          name={getName(artist.artisticName ? artist.artisticName : artist.band?.name)}
          officialWebsite={artist.artistInformation?.officialWebsite}
          biography={artist.artistInformation?.biography}
        />
      )}
    </>
  );
}

const getFlagEmoji = (countryCode = 'VE') => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());

  return String.fromCodePoint(...codePoints);
};
