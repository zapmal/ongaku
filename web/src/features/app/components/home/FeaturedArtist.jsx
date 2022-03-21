import { Box, Button, Badge, Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

import { GRID_COLUMN_HEIGHT } from '../../constants';

import { theme } from '@/stitches.config.js';
import { capitalizeEach } from '@/utils/capitalizeEach';

export function FeaturedArtistInformation({ name, amountOfFollowers, description }) {
  return (
    <Box height={GRID_COLUMN_HEIGHT}>
      <Badge color="whiteAlpha.900" bg={theme.colors.accentSolid.value}>
        ARTISTA DESTACADO DEL MES
      </Badge>
      <Flex>
        <Heading fontSize="6xl" paddingRight="20px">
          {capitalizeEach(name)}
        </Heading>
        <Flex flexFlow="column">
          <ActionButton marginTop="20px" as={Link} to={`/artist/${name}`}>
            IR A PÁGINA
          </ActionButton>
        </Flex>
      </Flex>
      <Text fontWeight="bold" paddingTop="10px">
        {amountOfFollowers === 1 ? '1 seguidor' : `${amountOfFollowers} seguidores`}
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
