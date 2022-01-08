import { Box, Button, Badge, Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react';

import { GRADIENTS, GRID_COLUMN_HEIGHT } from '../constants';

import { theme } from '@/stitches.config.js';

export function FeaturedArtistBanner({ image, children }) {
  return (
    <Box
      bg={`${GRADIENTS.top}, url(/assets/images/${image})`}
      bgRepeat="round"
      height="700px"
      width="100%"
    >
      {children}
    </Box>
  );
}

export function FeaturedArtistInformation({ name, amountOfFollowers, description }) {
  return (
    <Box height={GRID_COLUMN_HEIGHT}>
      <Badge color="whiteAlpha.900" bg={theme.colors.accentSolid.value}>
        FEATURED ARTIST OF THE MONTH
      </Badge>
      <Flex>
        <Heading fontSize="6xl" paddingRight="20px">
          {name}
        </Heading>
        <Flex flexFlow="column">
          <ActionButton>FOLLOW</ActionButton>
          <ActionButton marginTop="10px">GO TO PAGE</ActionButton>
        </Flex>
      </Flex>
      <Text fontWeight="bold" paddingTop="10px">
        {amountOfFollowers}
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
