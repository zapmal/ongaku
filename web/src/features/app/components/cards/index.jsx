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
import React from 'react';
import { FaScroll } from 'react-icons/fa';
import { IoMdHeart } from 'react-icons/io';
import { MdPlayArrow, MdMoreVert, MdOutlineQueue } from 'react-icons/md';

import { FADE_OUT_ANIMATION, MENU_ITEM_PROPS } from '../../constants';
import { useHover } from '../../hooks/useHover';

import { theme } from '@/stitches.config.js';

export function Card({ cover, children, type, ...extraStyles }) {
  const [isHovered, mouseEventsHandlers] = useHover();

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
        opacity={isHovered && 0.6}
        {...mouseEventsHandlers}
      />
      {isHovered && (
        <Box animation={FADE_OUT_ANIMATION}>
          {hoverButtons.map((button, index) => (
            <HoverButton key={index} button={button} mouseEventsHandlers={mouseEventsHandlers} />
          ))}
          <OptionsButton mouseEventsHandlers={mouseEventsHandlers} type={type} />
        </Box>
      )}
      {children}
    </Box>
  );
}

const hoverButtons = [
  {
    icon: MdPlayArrow,
    position: {
      bottom: '60px',
      right: '20px',
    },
  },
  {
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

function HoverButton({ button, mouseEventsHandlers }) {
  return (
    <IconButton
      borderRadius="50%"
      icon={<Icon as={button.icon} w="35px" h="35px" />}
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
function OptionsButton({ type, mouseEventsHandlers }) {
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
          Add to queue
        </MenuItem>

        <MenuDivider />
        {type !== 'playlist' && (
          <>
            <MenuOptionGroup title="Add to playlist">
              <MenuItem {...MENU_ITEM_PROPS} fontSize="sm">
                Big Boi tunes
              </MenuItem>
              <MenuItem {...MENU_ITEM_PROPS} fontSize="sm">
                OnlyPain Official Soundtrack
              </MenuItem>
            </MenuOptionGroup>
            <MenuDivider />
          </>
        )}
        <MenuItem
          {...MENU_ITEM_PROPS}
          icon={<Icon as={FaScroll} w="15px" h="15px" marginTop="5px" />}
        >
          Show credits
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
