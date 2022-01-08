import {
  Box,
  Badge,
  Flex,
  Image,
  Spacer,
  Text,
  Icon,
  IconButton,
  keyframes,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { IoMdHeart } from 'react-icons/io';
import { MdPlayArrow, MdMoreVert } from 'react-icons/md';

import { theme } from '@/stitches.config.js';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const animation = `${fadeIn} 300ms linear`;

export function SongCard({ cover, name, isExplicit, type, yearAndAuthors }) {
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
      bg={`linear-gradient(180deg, ${theme.colors.primaryBase.value} 5%, rgba(255,255,255,0) 60%)`}
    >
      <Image
        src={cover}
        width="200px"
        borderRadius="10px"
        transition="opacity 300ms ease-in-out"
        opacity={isHovered && 0.6}
        {...mouseHandlers}
      />
      {isHovered && (
        <Box animation={animation}>
          {actionButtonsProps.map((props, index) => (
            <ActionButton key={index} action={props} mouseHandlers={mouseHandlers} />
          ))}
        </Box>
      )}
      <Flex justify="end">
        <Text fontWeight="bold" marginRight="5px">
          {name}
        </Text>
        <Spacer />
        {isExplicit && (
          <Badge
            marginTop="5px"
            marginRight="5px"
            bg={theme.colors.dangerSolid.value}
            color="whiteAlpha.900"
          >
            E
          </Badge>
        )}
        <Badge marginTop="5px" color="whiteAlpha.900" bg={theme.colors.accentSolid.value}>
          {type}
        </Badge>
      </Flex>
      <Text color="whiteAlpha.700" fontWeight="bold">
        {yearAndAuthors}
      </Text>
    </Box>
  );
}

const actionButtonsProps = [
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
    icon: MdMoreVert,
    variant: 'ghost',
    position: {
      top: 1,
      right: 1,
    },
  },
];

function ActionButton({ action, mouseHandlers }) {
  return (
    <IconButton
      position="absolute"
      {...action.position}
      {...mouseHandlers}
      variant={action.variant}
      width="50px"
      height="50px"
      icon={<Icon as={action.icon} w="35px" h="35px" />}
      backgroundColor={!action.variant && theme.colors.primaryBase.value}
      _hover={{
        backgroundColor: action.hover || theme.colors.accentSolid.value,
      }}
      _active={{
        backgroundColor: action.active || theme.colors.accentSolidActive.value,
      }}
    />
  );
}
