import { Box, Button, Badge, Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react';

import { GRID_COLUMN_HEIGHT } from '../../constants';

import { theme } from '@/stitches.config.js';

export function FeaturedArtistInformation({ name, amountOfFollowers, description }) {
  return (
    <Box height={GRID_COLUMN_HEIGHT}>
      <Badge color="whiteAlpha.900" bg={theme.colors.accentSolid.value}>
        ARTISTA DESTACADO DEL MES
      </Badge>
      <Flex>
        <Heading fontSize="6xl" paddingRight="20px">
          {name}
        </Heading>
        <Flex flexFlow="column">
          <ActionButton marginTop="20px">IR A PÁGINA</ActionButton>
        </Flex>
      </Flex>
      <Text fontWeight="bold" paddingTop="10px">
        {amountOfFollowers} seguidores
      </Text>

      <Text width="70%" paddingTop="5px" color="whiteAlpha.800">
        {description}
      </Text>
    </Box>
  );
}

export function ActionButton({ children, ...extraStyles }) {
  return (
    <Button
      variant="outline"
      borderRadius="20px"
      {...extraStyles}
      _hover={{ bg: theme.colors.accentSolidHover.value }}
      _active={{ bg: theme.colors.accentSolidActive.value }}
    >
      {children}
    </Button>
  );
}
