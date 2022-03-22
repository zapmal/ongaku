import {
  Box,
  Image,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItem,
  MenuDivider,
  Spinner,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaHeartBroken } from 'react-icons/fa';
import { IoMdHeart } from 'react-icons/io';
import { MdPlayArrow, MdMoreVert, MdOpenInNew } from 'react-icons/md';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, Link } from 'react-router-dom';

import { likeAlbum, isAlbumLiked } from '../../api/album';
import {
  likePlaylist,
  isPlaylistLiked,
  getLikedPlaylists,
  addAlbumToPlaylist,
  getLikedSongs,
} from '../../api/playlist';
import { updateQueue } from '../../api/rooms';
import { FADE_OUT_ANIMATION, MENU_ITEM_PROPS } from '../../constants';
import { useHover } from '../../hooks/useHover';

import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useQueueStore } from '@/stores/useQueueStore';
import { useRoomStore } from '@/stores/useRoomStore';
import { getLink } from '@/utils/getLink';

export function Card({
  id,
  to = '',
  cover,
  type,
  notLikeable = false,
  isLiked,
  children,
  isLikedSongsPlaylist = false,
  ...extraStyles
}) {
  const entity = useAuthStore((s) => s.entity);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const [isHovered, mouseEventsHandlers] = useHover();
  const [liked, setLiked] = useState(isLiked);
  const [isLoading, setLoading] = useState(false);
  const [songs, setSongs] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [_, link] = getLink(to, to);

  useEffect(() => {
    if (isLikedSongsPlaylist) {
      setLoading(true);
      getLikedSongs()
        .then((response) => {
          const likedSongs = response.songsInPlaylist.map(({ song }) => ({ ...song }));

          setSongs(likedSongs);
        })
        .catch((error) => {
          addNotification({
            title: 'Error',
            message: error,
            status: 'error',
          });
        });
    }

    if (isHovered && id && entity.role !== 'ARTIST') {
      setLoading(true);
      if (type === 'playlist') {
        isPlaylistLiked({ playlistId: id })
          .then((response) => {
            console.log('Querying isPlaylistLiked');
            setLiked(response.isLiked);
            setSongs(response.songs);
          })
          .catch((error) => {
            addNotification({
              title: 'Error',
              message: error,
              status: 'error',
            });
          })
          .finally(() => setLoading(false));
      } else {
        isAlbumLiked({ albumId: id })
          .then((response) => {
            console.log('Querying isAlbumLiked');
            setLiked(response.isLiked);
            setSongs(response.songs);
          })
          .catch((error) => {
            addNotification({
              title: 'Error',
              message: error,
              status: 'error',
            });
          })
          .finally(() => setLoading(false));
      }
    }
  }, [entity.role, id, isHovered, isLiked, isLikedSongsPlaylist, notLikeable, type]);

  return (
    <Box
      marginRight="15px"
      position="relative"
      borderRadius="10px"
      height="250px"
      width="200px"
      bg={`linear-gradient(180deg, ${theme.colors.primaryBase.value} 5%, rgba(255,255,255,0) 60%)`}
      {...extraStyles}
    >
      <Image
        src={cover}
        height="200px"
        borderRadius="10px"
        transition="opacity 300ms ease-in-out"
        objectFit="cover"
        opacity={isHovered && 0.6}
        {...mouseEventsHandlers}
      />
      {isHovered && (
        <Box animation={FADE_OUT_ANIMATION}>
          {notLikeable || entity.role === 'ARTIST'
            ? notLikeablePlaylistButtons.map((button, index) => (
                <HoverButton
                  id={id}
                  key={index}
                  button={button}
                  type={type}
                  to={link}
                  notLikeable={notLikeable}
                  mouseEventsHandlers={mouseEventsHandlers}
                  isLikedSongsPlaylist={isLikedSongsPlaylist}
                  songs={songs}
                />
              ))
            : hoverButtons.map((button, index) => (
                <HoverButton
                  id={id}
                  type={type}
                  songs={songs}
                  key={index}
                  isLoading={isLoading}
                  button={button}
                  liked={liked}
                  setLiked={setLiked}
                  mouseEventsHandlers={mouseEventsHandlers}
                />
              ))}
          {(!notLikeable || entity.role !== 'ARTIST') && !isLikedSongsPlaylist && (
            <OptionsButton
              mouseEventsHandlers={mouseEventsHandlers}
              type={type}
              to={link}
              id={id}
            />
          )}
        </Box>
      )}
      {children}
    </Box>
  );
}

const notLikeablePlaylistButtons = [
  {
    icon: MdOpenInNew,
    position: {
      bottom: '60px',
      left: '20px',
    },
  },
  {
    icon: MdPlayArrow,
    position: {
      bottom: '60px',
      right: '20px',
    },
  },
];

const hoverButtons = [
  {
    icon: MdPlayArrow,
    position: {
      bottom: '60px',
      right: '20px',
    },
  },
  {
    altIcon: FaHeartBroken,
    icon: IoMdHeart,
    position: {
      bottom: '60px',
      left: '20px',
    },
  },
];

const ICON_BUTTON_PROPS = {
  position: 'absolute',
  width: '50px',
  height: '50px',
};

function HoverButton({
  id,
  to,
  type,
  songs,
  button,
  liked,
  setLiked,
  notLikeable,
  isLoading,
  isLikedSongsPlaylist,
  mouseEventsHandlers,
}) {
  const navigate = useNavigate();
  const icon = button.altIcon && liked ? button.altIcon : button.icon;

  const addNotification = useNotificationStore((s) => s.addNotification);
  const entity = useAuthStore((s) => s.entity);
  const store = useQueueStore();
  const room = useRoomStore((s) => s.room);

  const queryClient = useQueryClient();
  const mutation = useMutation(type === 'playlist' ? likePlaylist : likeAlbum, {
    onSuccess: () => {
      queryClient.invalidateQueries('search');
      queryClient.invalidateQueries('library-albums');
      queryClient.invalidateQueries('library-playlists');
    },
  });
  const updateQueueMutation = useMutation(updateQueue, {
    onSuccess: () => {
      queryClient.invalidateQueries('all-rooms');
      if (room.key) {
        queryClient.invalidateQueries(`room-${room.key}`);
      }
    },
  });

  const handleOnLikeClick = async () => {
    if (notLikeable) {
      if (isLikedSongsPlaylist) {
        navigate('/view?liked=true&type=playlist');
      } else {
        navigate(`/view?id=${id}&type=${type === 'playlist' ? 'playlist' : 'album'}`);
      }
    } else {
      try {
        const data = type === 'playlist' ? { playlistId: id } : { albumId: id };

        await mutation.mutateAsync(data);

        setLiked(!liked);
      } catch (error) {
        addNotification({
          title: 'Error',
          message: error,
          status: 'error',
        });
      }
    }
  };

  const handleOnPlayClick = async () => {
    try {
      if (songs.length !== 0) {
        if (room.length === 0) {
          store.add(songs);
        } else if (room.host === entity.id) {
          store.add(songs);

          await updateQueueMutation.mutateAsync({ key: room.key, queue: store.queue.toArray() });
        }
      }
    } catch (error) {
      addNotification({
        title: 'Error',
        message: error,
        status: 'error',
      });
    }
  };

  return (
    <IconButton
      borderRadius="50%"
      isDisabled={mutation.isLoading}
      onClick={button.icon !== MdPlayArrow ? handleOnLikeClick : handleOnPlayClick}
      icon={<Icon as={isLoading ? Spinner : icon} w="35px" h="35px" />}
      backgroundColor={theme.colors.primaryBase.value}
      _hover={{
        backgroundColor: theme.colors.accentSolid.value,
      }}
      _active={{
        backgroundColor: theme.colors.accentSolidActive.value,
      }}
      {...button.position}
      {...ICON_BUTTON_PROPS}
      {...mouseEventsHandlers}
    />
  );
}

function OptionsButton({ id, type, to, mouseEventsHandlers }) {
  const addNotification = useNotificationStore((s) => s.addNotification);

  const { data, isLoading, isError } = useQuery('library-playlists', getLikedPlaylists);
  const mutation = useMutation(addAlbumToPlaylist);

  const handleClick = async (playlistId) => {
    try {
      await mutation.mutateAsync({ playlistId, albumId: id });
    } catch (error) {
      addNotification({
        title: 'Error',
        message: error,
        status: 'error',
      });
    }
  };

  return (
    <Menu isLazy closeOnBlur={false} gutter={2} placement="left">
      <MenuButton
        as={IconButton}
        {...mouseEventsHandlers}
        {...ICON_BUTTON_PROPS}
        borderRadius="5px"
        icon={<Icon as={MdMoreVert} w="35px" h="35px" />}
        variant="ghost"
        top="5px"
        right="5px"
        margin={0}
        _active={{
          backgroundColor: 'blackAlpha.500',
        }}
        _hover={{
          backgroundColor: 'transparent',
        }}
      />
      <MenuList
        bg={theme.colors.primaryBase.value}
        {...mouseEventsHandlers}
        marginTop="10px"
        maxHeight="300px"
        overflowY="auto"
      >
        <MenuItem
          {...MENU_ITEM_PROPS}
          icon={<Icon as={MdOpenInNew} w="15px" h="15px" marginTop="5px" />}
          as={Link}
          to={`/view?id=${id}&type=${type === 'playlist' ? 'playlist' : 'album'}`}
        >
          Abrir
        </MenuItem>

        <MenuDivider />
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
            data.playlists.map((playlist, index) => {
              if (playlist.id === id) return null;

              return (
                <MenuItem
                  key={index}
                  {...MENU_ITEM_PROPS}
                  fontSize="sm"
                  onClick={() => handleClick(playlist.id)}
                >
                  {playlist.name}
                </MenuItem>
              );
            })
          )}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}
