import { Avatar, Flex, Box, Text, Spacer, Tooltip, Icon, IconButton } from '@chakra-ui/react';
import React from 'react';
import { MdAdd } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { useHover } from '../hooks/useHover';

import { theme } from '@/stitches.config.js';

export function ArtistRow({ name, image, amountOfFollowers, to }) {
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
