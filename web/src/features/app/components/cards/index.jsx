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
import { FADE_OUT_ANIMATION, MENU_ITEM_PROPS } from '../../constants';
import { useHover } from '../../hooks/useHover';

import { theme } from '@/stitches.config.js';
import { useQueueStore } from '@/stores/useQueueStore';
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
          console.log(error);
        });
    }

    if (isHovered && id) {
      setLoading(true);
      if (type === 'playlist') {
        isPlaylistLiked({ playlistId: id })
          .then((response) => {
            console.log('Querying isPlaylistLiked');
            setLiked(response.isLiked);
            setSongs(response.songs);
          })
          .catch((error) => {
            console.log(error);
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
            console.log(error);
          })
          .finally(() => setLoading(false));
      }
    }
  }, [id, isHovered, isLiked, notLikeable, type]);

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
          {notLikeable
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
          {!notLikeable && (
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

  const queryClient = useQueryClient();
  const mutation = useMutation(type === 'playlist' ? likePlaylist : likeAlbum, {
    onSuccess: () => {
      queryClient.invalidateQueries('library-albums');
      queryClient.invalidateQueries('library-playlists');
    },
  });

  const add = useQueueStore((s) => s.add);

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
        console.log('Error al registrar el like/dislike', error);
      }
    }
  };

  const handleOnPlayClick = () => {
    if (songs.length !== 0) add(songs);
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
  const { data, isLoading, isError } = useQuery('library-playlists', getLikedPlaylists);
  const mutation = useMutation(addAlbumToPlaylist);

  const handleClick = async (playlistId) => {
    try {
      await mutation.mutateAsync({ playlistId, albumId: id });
    } catch (error) {
      console.log('Error al intentar agregar las canciones', error);
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
          to={`/view?id=${id}&type=${type === 'playlist' ? 'playlits' : 'album'}`}
        >
          Abrir
        </MenuItem>

        <MenuDivider />
        {type !== 'playlist' && (
          <>
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
          </>
        )}
      </MenuList>
    </Menu>
  );
}
