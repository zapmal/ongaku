import {
  Box,
  Image,
  Avatar,
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
import { Link } from 'react-router-dom';

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

export function ArtistCard({
  image,
  name,
  amountOfFollowers,
  isHighlighted,
  to,
  size = 'lg',
  badge = true,
}) {
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
              to={to}
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
            {badge && (
              <Badge bg={theme.colors.accentSolid.value} color="whiteAlpha.900" height="100%">
                ARTIST
              </Badge>
            )}
          </Flex>
          <Text color="whiteAlpha.700" fontSize="sm" textAlign="left">
            {amountOfFollowers} followers
          </Text>
        </>
      )}
    </Box>
  );
}

export function SmallArtistCard({ name, image, amountOfFollowers, to }) {
  const [isHovered, mouseEventsHandlers] = useHover();

  return (
    <Flex align="center" margin="13px 0" width="75%">
      <Avatar
        size="lg"
        transition="opacity 300ms ease-in-out"
        as={Link}
        to={to}
        src={image}
        opacity={isHovered && 0.6}
        {...mouseEventsHandlers}
      />
      <Box marginLeft="20px">
        <Text color={theme.colors.accentText.value} fontSize="lg" fontWeight="bold">
          {name}
        </Text>
        <Text color="whiteAlpha.700" fontSize="sm" textAlign="left">
          {amountOfFollowers} followers
        </Text>
      </Box>

      <Spacer />
      <Tooltip label={`Follow ${name}`}>
        <IconButton
          icon={<Icon as={MdAdd} />}
          variant="outline"
          _hover={{
            color: 'whiteAlpha.800',
          }}
          _active={{
            color: theme.colors.accentSolidActive.value,
            borderColor: theme.colors.accentSolidActive.value,
          }}
        />
      </Tooltip>
    </Flex>
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

function HoverButton({ button, size, to, mouseEventsHandlers }) {
  const goToPageProps = to && button.text.includes('Page') && { as: Link, to };
  return (
    <Tooltip label={button.text}>
      <IconButton
        position="absolute"
        top={sizes[size].top}
        {...goToPageProps}
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
