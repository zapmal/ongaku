import {
  Box,
  Image,
  Heading,
  Flex,
  Spacer,
  Text,
  IconButton,
  Icon,
  Tooltip,
  Badge,
} from '@chakra-ui/react';
import React from 'react';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { MdAdd } from 'react-icons/md';

import { FADE_OUT_ANIMATION } from '../../constants';
import { useHover } from '../../hooks/useHover';

import { theme } from '@/stitches.config.js';

const sizes = {
  sm: {
    top: '80px',
    boxHeight: '250px',
    width: '200px',
    height: '200px',
    borderRadius: '10px',
  },
  lg: {
    top: '100px',
    margin: '10px',
    width: '250px',
    height: '250px',
    borderRadius: '50%',
  },
};

export function ArtistCard({ image, name, amountOfFollowers, isHighlighted, size = 'lg' }) {
  const [isHovered, mouseEventsHandlers] = useHover();

  return (
    <Box
      margin={sizes[size].margin}
      height={sizes[size].boxHeight}
      marginRight="15px"
      textAlign="center"
      position="relative"
    >
      <Image
        src={image}
        width={sizes[size].width}
        height={sizes[size].height}
        borderRadius={sizes[size].borderRadius}
        opacity={isHovered && 0.6}
        transition="opacity 300ms ease-in-out"
        {...mouseEventsHandlers}
      />
      {isHovered && (
        <Box animation={FADE_OUT_ANIMATION}>
          {hoverButtons.map((button, index) => (
            <HoverButton
              key={index}
              button={button}
              mouseEventsHandlers={mouseEventsHandlers}
              size={size}
            />
          ))}
        </Box>
      )}
      {size === 'lg' ? (
        <>
          <Heading color={isHighlighted && theme.colors.accentText.value} fontSize="3xl">
            {name}
          </Heading>
          <Text color="whiteAlpha.800">{amountOfFollowers} followers</Text>
        </>
      ) : (
        <>
          <Flex align="center">
            <Text fontWeight="bold">{name}</Text>
            <Spacer />
            <Badge bg={theme.colors.accentSolid.value} color="whiteAlpha.900" height="100%">
              ARTIST
            </Badge>
          </Flex>
          <Text color="whiteAlpha.700" fontSize="sm" textAlign="left">
            {amountOfFollowers} followers
          </Text>
        </>
      )}
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

function HoverButton({ button, size, mouseEventsHandlers }) {
  return (
    <Tooltip label={button.text}>
      <IconButton
        position="absolute"
        top={sizes[size].top}
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
