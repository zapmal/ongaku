import {
  Tooltip,
  IconButton as ChakraIconButton,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItem,
  MenuDivider,
  Flex,
  Image,
  Text,
  Spacer,
  Badge,
  Box,
  Spinner,
} from '@chakra-ui/react';
import React from 'react';
import { IoMdHeartEmpty, IoMdRemoveCircleOutline } from 'react-icons/io';
import { MdMoreVert, MdPlayArrow, MdPause } from 'react-icons/md';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAudioPlayer } from 'react-use-audio-player';

import { addSongToPlaylist, getLikedPlaylists } from '../api/playlist';
import { updateQueue } from '../api/rooms';
import { MENU_ITEM_PROPS, FADE_OUT_ANIMATION } from '../constants';
import { useHover } from '../hooks/useHover';

import { Link } from '@/components/Elements';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useQueueStore } from '@/stores/useQueueStore';
import { useRoomStore } from '@/stores/useRoomStore';
import { getLink } from '@/utils/getLink';
import { getName } from '@/utils/getName';

export function SongRow({
  name,
  cover,
  isExplicit,
  authors,
  albumName,
  year,
  duration,
  width = '75%',
}) {
  const [isHovered, mouseEventsHandlers] = useHover();

  return (
    <Flex align="center" margin="15px 0" width={width} {...mouseEventsHandlers}>
      {isHovered ? (
        <Box animation={FADE_OUT_ANIMATION}>
          <IconButton icon={MdPlayArrow} size="lg" w="40px" h="40px" />
        </Box>
      ) : (
        <Image src={cover} w="60px" h="60px" borderRadius="5px" />
      )}

      <SongInformation
        name={name}
        isExplicit={isExplicit}
        authors={authors}
        albumName={albumName}
        year={year}
      />

      <Options isHovered={isHovered} duration={duration} isLarge={true} />
    </Flex>
  );
}

export function SongInQueue({
  song,
  isPlaying,
  itemNumber,
  name,
  authors,
  duration,
  isExplicit,
  canEdit = true,
}) {
  const [isHovered, mouseEventsHandlers] = useHover();
  const { playing, togglePlayPause, error, ready } = useAudioPlayer();
  const addNotification = useNotificationStore((s) => s.addNotification);

  return (
    <Flex align="center" margin="10px 0" {...mouseEventsHandlers}>
      {isPlaying ? (
        <Box
          animation={FADE_OUT_ANIMATION}
          onClick={
            ready
              ? togglePlayPause
              : () => {
                  if (error) {
                    addNotification({
                      title: 'Error',
                      status: 'error',
                      message: 'No pudimos reproducir la canción, intentalo de nuevo luego',
                    });
                  }
                }
          }
        >
          <IconButton icon={playing ? MdPause : MdPlayArrow} w="20px" h="20px" />
        </Box>
      ) : (
        <Text color="whiteAlpha.700" width="20px" margin="5px 6.1px" textAlign="center">
          {itemNumber}
        </Text>
      )}

      <SongInformation
        name={name}
        isPlaying={isPlaying}
        isExplicit={isExplicit}
        authors={authors}
      />

      <Options
        isHovered={isHovered}
        duration={duration}
        song={song}
        noHeart={true}
        canEdit={canEdit}
      />
    </Flex>
  );
}

function SongInformation({ name, isPlaying, isExplicit, authors, albumName, year }) {
  return (
    <>
      <Box marginLeft="10px" textAlign="left">
        <Text color={isPlaying || albumName ? theme.colors.accentText.value : 'whiteAlpha.800'}>
          {name}{' '}
          {isExplicit && (
            <Badge bg={theme.colors.dangerSolid.value} color="whiteAlpha.900">
              E
            </Badge>
          )}
        </Text>
        <Text fontSize="xs" color={theme.colors.primaryText.value}>
          {authors.split(',').map((author, index) => {
            return (
              <Link to={`/artist/${author}`} key={index} underline={false} variant="gray">
                {authors.split(',').length !== index + 1
                  ? `${getName(author.trim())}, `
                  : getName(author.trim())}
              </Link>
            );
          })}
          {albumName &&
            albumName.split(',').map((a, index) => {
              const [linkText, authorPath] = getLink(a, albumName);
              return (
                <React.Fragment key={index}>
                  {' - '}
                  <Link to={`/view/${authorPath}`} underline={false} variant="gray">
                    {linkText}
                  </Link>
                  {' - '}
                </React.Fragment>
              );
            })}
          {year}
        </Text>
      </Box>

      <Spacer />
    </>
  );
}

export function Options({
  song,
  isHovered,
  duration,
  isLarge = false,
  onlyHeart = false,
  noHeart = false,
  canEdit,
}) {
  const entity = useAuthStore((s) => s.entity);

  return (
    <>
      {isHovered && canEdit && (
        <Box animation={FADE_OUT_ANIMATION} textAlign="left">
          {!onlyHeart && (
            <>
              {entity.role !== 'ARTIST' && <OptionMenu isLarge={isLarge} song={song} />}
              {!noHeart && <Option icon={IoMdHeartEmpty} isLarge={isLarge} />}
            </>
          )}
        </Box>
      )}

      {onlyHeart && !noHeart && <Option icon={IoMdHeartEmpty} isLarge={isLarge} />}

      <Text
        color={theme.colors.primaryText.value}
        fontSize={isLarge ? 'md' : 'sm'}
        marginRight="5px"
        marginLeft={isLarge && '5px'}
      >
        {duration}
      </Text>
    </>
  );
}

const DIMENSIONS = {
  w: '25px',
  h: '25px',
};

export function IconButton({ icon, size = 'sm', w = DIMENSIONS.w, h = DIMENSIONS.h }) {
  const customSize = size !== 'sm' && { w: '60px', h: '60px' };
  return (
    <ChakraIconButton
      bg="whiteAlpha.900"
      borderRadius="50%"
      size={size}
      {...customSize}
      icon={<Icon as={icon} w={w} h={h} color={theme.colors.primaryBase.value} />}
    />
  );
}

export function Option({ icon, label, isLarge = false, ...styles }) {
  const dimensions = isLarge && { ...DIMENSIONS };
  const iconButton = (
    <ChakraIconButton
      {...styles}
      variant="ghost"
      icon={<Icon as={icon} {...dimensions} />}
      _hover={{
        color: theme.colors.accentSolidHover.value,
      }}
      _active={{
        color: theme.colors.accentSolidActive.value,
      }}
    />
  );

  return label ? <Tooltip label={label}>{iconButton}</Tooltip> : iconButton;
}

export function OptionMenu({ song, isLarge = false, ...styles }) {
  const { data, isLoading, isError } = useQuery('library-playlists', getLikedPlaylists);

  const entity = useAuthStore((s) => s.entity);
  const room = useRoomStore((s) => s.room);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const store = useQueueStore();

  const dimensions = isLarge && { ...DIMENSIONS };

  const queryClient = useQueryClient();
  const mutation = useMutation(addSongToPlaylist);
  const updateQueueMutation = useMutation(updateQueue, {
    onSuccess: () => {
      queryClient.invalidateQueries('all-rooms');
      if (room.length !== 0) {
        queryClient.invalidateQueries(`room-${room.key}`);
      }
    },
  });

  const handleClick = async (playlistId) => {
    try {
      await mutation.mutateAsync({ playlistId, songId: song.id });
    } catch (error) {
      console.log('Error al intentar agregar las canciones', error);
    }
  };

  const handleUpdateQueue = async () => {
    try {
      await updateQueueMutation.mutateAsync({ key: room.key, queue: store.queue.toArray() });
    } catch (error) {
      console.log(error);
      addNotification({
        title: 'Error',
        status: 'error',
        message: error,
      });
    }
  };

  return (
    <Menu isLazy placement="top-end" gutter={2} {...styles}>
      <MenuButton
        as={ChakraIconButton}
        variant="ghost"
        icon={<Icon as={MdMoreVert} {...dimensions} />}
        _hover={{
          color: theme.colors.accentSolidHover.value,
        }}
        _active={{
          color: theme.colors.accentSolidActive.value,
        }}
      />
      <MenuList bg={theme.colors.primaryBase.value} maxHeight="300px" overflowY="auto">
        {!isLarge && (
          <>
            <MenuItem
              {...MENU_ITEM_PROPS}
              icon={<Icon as={IoMdRemoveCircleOutline} w="15px" h="15px" marginTop="5px" />}
              onClick={() => {
                store.remove(song);
                if (room.length !== 0 && room.host === entity.id) {
                  if (room.queue.length === 1) {
                    addNotification({
                      title: 'Aviso',
                      status: 'info',
                      message:
                        'No puedes eliminar la última canción en la sala, agrega más canciones o cierra la sala',
                    });
                  } else {
                    handleUpdateQueue();
                  }
                }
              }}
              fontSize="sm"
            >
              Remover de la cola
            </MenuItem>
            <MenuDivider />
          </>
        )}

        <MenuOptionGroup title="Agregar a Playlist">
          {isLoading ? (
            <Box marginTop="10px" textAlign="center">
              <Spinner />
            </Box>
          ) : isError ? (
            <MenuItem {...MENU_ITEM_PROPS} fontSize="sm" isDisabled={true}>
              Ha ocurrido un error
            </MenuItem>
          ) : data.playlists.length === 0 ? (
            <MenuItem {...MENU_ITEM_PROPS} fontSize="sm" isDisabled={true}>
              No tienes playlists
            </MenuItem>
          ) : (
            data.playlists.map((playlist, index) => (
              <MenuItem
                key={index}
                {...MENU_ITEM_PROPS}
                fontSize="sm"
                onClick={() => handleClick(playlist.id)}
              >
                {playlist.name}
              </MenuItem>
            ))
          )}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}
