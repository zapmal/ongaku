import { Box, Image, Heading, Text, IconButton, Icon, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { MdAdd } from 'react-icons/md';

import { FADE_OUT_ANIMATION } from '../constants';
import { useHover } from '../hooks/useHover';

import { theme } from '@/stitches.config.js';

export function ArtistIcon({ image, name, amountOfFollowers, isHighlighted }) {
  const [isHovered, mouseEventsHandlers] = useHover();

  return (
    <Box margin="15px" textAlign="center" position="relative">
      <Image
        src={image}
        width="250px"
        minHeight="250px"
        borderRadius="50%"
        opacity={isHovered && 0.6}
        transition="opacity 300ms ease-in-out"
        {...mouseEventsHandlers}
      />
      {isHovered && (
        <Box animation={FADE_OUT_ANIMATION}>
          {hoverButtons.map((button, index) => (
            <HoverButton key={index} button={button} mouseEventsHandlers={mouseEventsHandlers} />
          ))}
        </Box>
      )}
      <Heading color={isHighlighted && theme.colors.accentText.value}>{name}</Heading>

      <Text color="whiteAlpha.800">{amountOfFollowers} followers</Text>
    </Box>
  );
}

const hoverButtons = [
  {
    icon: MdAdd,
    text: 'Follow Artist',
    position: {
      right: '40px',
    },
  },
  {
    icon: HiOutlineExternalLink,
    text: 'Go to Page',
    position: {
      left: '40px',
    },
  },
];

function HoverButton({ button, mouseEventsHandlers }) {
  return (
    <Tooltip label={button.text}>
      <IconButton
        position="absolute"
        top="100px"
        {...button.position}
        variant={button.variant}
        width="50px"
        height="50px"
        icon={<Icon as={button.icon} w="35px" h="35px" />}
        backgroundColor="transparent"
        _hover={{
          color: 'whiteAlpha.800',
        }}
        _active={{
          color: theme.colors.accentSolidActive.value,
        }}
        {...mouseEventsHandlers}
      />
    </Tooltip>
  );
}
