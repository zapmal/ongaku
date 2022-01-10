import { Box, Image, Icon, IconButton } from '@chakra-ui/react';
import React from 'react';
import { IoMdHeart } from 'react-icons/io';
import { MdPlayArrow, MdMoreVert } from 'react-icons/md';

import { FADE_OUT_ANIMATION } from '../../constants';
import { useHover } from '../../hooks/useHover';

import { theme } from '@/stitches.config.js';

export function Card({ cover, children, ...extraStyles }) {
  const [isHovered, mouseEventsHandlers] = useHover();

  return (
    <Box
      marginRight="20px"
      position="relative"
      borderRadius="10px"
      maxWidth="200px"
      // width="50%"
      height="95%"
      bg={`linear-gradient(180deg, ${theme.colors.primaryBase.value} 5%, rgba(255,255,255,0) 60%)`}
      {...extraStyles}
    >
      <Image
        src={cover}
        minHeight="200px"
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
  {
    hover: 'transparent',
    active: 'blackAlpha.500',
    variant: 'ghost',
    icon: MdMoreVert,
    position: {
      top: 1,
      right: 1,
    },
  },
];

function HoverButton({ button, mouseEventsHandlers }) {
  return (
    <IconButton
      position="absolute"
      {...button.position}
      variant={button.variant}
      borderRadius="50%"
      width="50px"
      height="50px"
      icon={<Icon as={button.icon} w="35px" h="35px" />}
      backgroundColor={!button.variant && theme.colors.primaryBase.value}
      _hover={{
        backgroundColor: button.hover || theme.colors.accentSolid.value,
      }}
      _active={{
        backgroundColor: button.active || theme.colors.accentSolidActive.value,
      }}
      {...mouseEventsHandlers}
    />
  );
}
