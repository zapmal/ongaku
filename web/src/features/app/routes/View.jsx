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
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { deleteAlbum, getAlbum } from '../api/album';
import { deletePlaylist, getPlaylist } from '../api/playlist';

import { Footer } from '@/components/Core';
import { Banner, Link } from '@/components/Elements';
import { Spinner } from '@/components/Utils';
import { OptionMenu } from '@/features/app';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';
import { copyURL } from '@/utils/copyURL';
import { getImage } from '@/utils/getImage';
import { getName } from '@/utils/getName';

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
  const entity = useAuthStore((s) => s.entity);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  const { data, isLoading } = useQuery(
    `view-${type}-${id}`,
    () => (type === 'playlist' ? getPlaylist(id) : getAlbum(id)),
    {
      onError: () => navigate('/not-found'),
    }
  );
  const queryClient = useQueryClient();
  const mutation = useMutation(type === 'playlist' ? deletePlaylist : deleteAlbum, {
    onSuccess: () => {
      queryClient.invalidateQueries(`view-${type}-${id}`);
      navigate('/library');
    },
  });

  const handleOnClick = async () => {
    try {
      await mutation.mutateAsync(id);
    } catch (error) {
      console.log('Error al intentar eliminar la playlist', error);
    }
  };

  if (isLoading) {
    return <Spinner paddingBottom="100%" />;
  }

  return (
    <Box>
      <Banner
        image={getImage(
          type === 'playlist' ? 'playlist' : 'view',
          type === 'playlist' ? data.background : null,
          'default/default.svg'
        )}
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
                <Avatar
                  src={getImage(
                    type === 'playlist' ? 'user' : 'artist',
                    type === 'playlist' ? data?.user.avatar : data?.artist.avatar,
                    'default/default_avatar.svg'
                  )}
                />
                <Link
                  to={
                    type === 'playlist'
                      ? `/user/${data?.user.username}`
                      : `/artist/${
                          data?.artist?.artisticName
                            ? data?.artist?.artisticName
                            : data?.artist?.band?.name
                        }`
                  }
                  underline={false}
                  fontWeight="bold"
                >
                  {type === 'playlist'
                    ? getName(data?.user.username)
                    : data?.artist?.artisticName
                    ? getName(data?.artist?.artisticName)
                    : getName(data?.artist?.band?.name)}
                </Link>
              </HStack>
              {data.name}
            </Heading>

            <HStack color="whiteAlpha.800" marginTop="5px">
              <Text fontWeight="bold">
                {type.toUpperCase()}{' '}
                {type === 'album' && (
                  <>
                    {' - '}
                    {data.releaseType.toUpperCase()}
                    {' - '}
                  </>
                )}
              </Text>
              <Text>
                {type === 'playlist' ? data.songsInPlaylist?.length : data.song?.length} canciones{' '}
              </Text>
            </HStack>

            <HStack marginTop="30px">
              <Button
                onClick={() => copyURL(`view?id=${id}&type=${type}`)}
                {...BUTTON_PROPS}
                rightIcon={<Icon as={MdShare} w="20px" h="20px" />}
              >
                Compartir
              </Button>
              {(entity.id === data?.artist?.id ||
                entity.id === data?.user?.id ||
                entity.role === 'ADMIN') && (
                <Button
                  variant="outline"
                  onClick={handleOnClick}
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
              )}
            </HStack>
          </SimpleGrid>
        </Flex>
      </Banner>
      <Table variant="unstyled">
        <Thead color={theme.colors.accentText.value}>
          <Tr>
            <Th>#</Th>
            {type === 'playlist' && <Th>Portada</Th>}
            <Th>Nombre</Th>
            <Th>{type === 'playlist' ? 'Autor(es)' : 'Colaboradores'}</Th>
            {type === 'playlist' && <Th>Album</Th>}
            <Th>Opciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.songsInPlaylist?.length === 0 && data.song?.length === 0
            ? null
            : data.songsInPlaylist?.length
            ? data.songsInPlaylist.map(({ song }, index) => {
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
                      <Image
                        src={getImage('album', song.album.cover, 'default/default_album.png')}
                        w="50px"
                        h="50px"
                        borderRadius="5px"
                      />
                    </Td>
                    <Td>{song.name}</Td>
                    <Td>
                      {song.artist.artisticName
                        ? getName(song.artist.artisticName)
                        : getName(song.artist.band.name)}
                      {song?.collaborators[0] !== '' && ', '}
                      {song?.collaborators.map((collaborator, index) => {
                        return song?.collaborators.length !== index + 1
                          ? `${getName(collaborator)}, `
                          : getName(collaborator);
                      })}
                    </Td>
                    <Td>
                      <Link
                        to={`/view?id=${song.albumId}&type=album`}
                        underline={false}
                        variant="gray"
                      >
                        {song.album.name}
                      </Link>
                    </Td>
                    <Td color="white">
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
              })
            : data.song?.length
            ? data.song.map((song, index) => {
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
                    <Td>{song.name}</Td>
                    <Td>
                      {song?.collaborators[0] !== ''
                        ? song?.collaborators.map((collaborator, index) => {
                            return song?.collaborators.length !== index + 1
                              ? `${getName(collaborator)}, `
                              : getName(collaborator);
                          })
                        : 'Ninguno'}
                    </Td>
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
              })
            : null}
        </Tbody>
      </Table>

      <Footer topMargin="40px" />
    </Box>
  );
}
