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
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaHeartBroken } from 'react-icons/fa';
import { IoMdHeart } from 'react-icons/io';
import { MdPlayArrow, MdMoreVert, MdOutlineQueue, MdOpenInNew } from 'react-icons/md';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate, Link } from 'react-router-dom';

import { likeAlbum } from '../../api/album';
import { likePlaylist } from '../../api/playlist';
import { FADE_OUT_ANIMATION, MENU_ITEM_PROPS } from '../../constants';
import { useHover } from '../../hooks/useHover';

import { theme } from '@/stitches.config.js';
import { getLink } from '@/utils/getLink';

export function Card({
  id,
  to = '',
  cover,
  type,
  notLikeable = false,
  isLiked,
  children,
  ...extraStyles
}) {
  const [isHovered, mouseEventsHandlers] = useHover();
  const [liked, setLiked] = useState(isLiked);
  // eslint-disable-next-line no-unused-vars
  const [_, link] = getLink(to, to);

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
            ? likedSongsPlaylistButtons.map((button, index) => (
                <HoverButton
                  key={index}
                  button={button}
                  to={link}
                  notLikeable={notLikeable}
                  mouseEventsHandlers={mouseEventsHandlers}
                />
              ))
            : hoverButtons.map((button, index) => (
                <HoverButton
                  key={index}
                  button={button}
                  liked={liked}
                  setLiked={setLiked}
                  id={id}
                  type={type}
                  mouseEventsHandlers={mouseEventsHandlers}
                />
              ))}
          {!notLikeable && (
            <OptionsButton mouseEventsHandlers={mouseEventsHandlers} type={type} to={link} />
          )}
        </Box>
      )}
      {children}
    </Box>
  );
}

const likedSongsPlaylistButtons = [
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

function HoverButton({ button, liked, setLiked, notLikeable, to, id, type, mouseEventsHandlers }) {
  const navigate = useNavigate();
  const icon = button.altIcon && liked ? button.altIcon : button.icon;

  const queryClient = useQueryClient();
  const mutation = useMutation(type === 'playlist' ? likePlaylist : likeAlbum, {
    onSuccess: () => queryClient.invalidateQueries('library-albums'),
  });

  const handleOnClick = async () => {
    if (notLikeable) {
      navigate(`/view/${to}`);
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

  return (
    <IconButton
      borderRadius="50%"
      onClick={button.icon !== MdPlayArrow ? handleOnClick : () => {}}
      icon={<Icon as={icon} w="35px" h="35px" />}
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

/**
 * This is intentionally missing some options that will *probably* be added in the future (i.e. deleting)
 */
function OptionsButton({ type, to, mouseEventsHandlers }) {
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
      <MenuList bg={theme.colors.primaryBase.value} {...mouseEventsHandlers} marginTop="10px">
        <MenuItem
          {...MENU_ITEM_PROPS}
          icon={<Icon as={MdOutlineQueue} w="15px" h="15px" marginTop="5px" />}
        >
          Agregar a la cola
        </MenuItem>
        <MenuItem
          {...MENU_ITEM_PROPS}
          icon={<Icon as={MdOpenInNew} w="15px" h="15px" marginTop="5px" />}
          as={Link}
          to={`/view/${to}`}
        >
          Abrir
        </MenuItem>

        <MenuDivider />
        {type !== 'playlist' && (
          <>
            <MenuOptionGroup title="Agregar a Playlist">
              <MenuItem {...MENU_ITEM_PROPS} fontSize="sm">
                Big Boi tunes
              </MenuItem>
              <MenuItem {...MENU_ITEM_PROPS} fontSize="sm">
                OnlyPain Official Soundtrack
              </MenuItem>
            </MenuOptionGroup>
          </>
        )}
      </MenuList>
    </Menu>
  );
}
