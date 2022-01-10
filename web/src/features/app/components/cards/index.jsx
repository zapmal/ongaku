import { Box, Image, Icon, IconButton, keyframes } from '@chakra-ui/react';
import React, { useState } from 'react';
import { IoMdHeart } from 'react-icons/io';
import { MdPlayArrow, MdMoreVert } from 'react-icons/md';

import { theme } from '@/stitches.config.js';

const fadeOutSteps = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const fadeOutAnimation = `${fadeOutSteps} 300ms linear`;

export function Card({ cover, children, ...extraStyles }) {
  const [isHovered, setIsHovered] = useState(false);

  const mouseHandlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

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
        {...mouseHandlers}
      />
      {isHovered && (
        <Box animation={fadeOutAnimation}>
          {hoverButtons.map((button, index) => (
            <HoverButton key={index} button={button} mouseHandlers={mouseHandlers} />
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

function HoverButton({ button, mouseHandlers }) {
  return (
    <IconButton
      position="absolute"
      {...button.position}
      variant={button.variant}
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
      {...mouseHandlers}
    />
  );
}
