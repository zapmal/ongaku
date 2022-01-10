import { Badge, Flex, Spacer, Text } from '@chakra-ui/react';
import React from 'react';

import { Card } from './index';

import { theme } from '@/stitches.config.js';

export function PlaylistCard({ cover, name, likes, amountOfSongs, author }) {
  return (
    <Card cover={cover}>
      <Badge marginTop="5px" position="absolute" top={1} left={1}>
        Playlist
      </Badge>
      <Flex justify="end">
        <Text fontWeight="bold" marginRight="5px" color={theme.colors.accentText.value}>
          {name}
        </Text>
        <Spacer />
        <Text fontWeight="bold" fontSize="sm">
          {likes} likes
        </Text>
      </Flex>

      <Flex justify="end">
        <Text color="whiteAlpha.700" fontSize="sm" maxWidth="60%">
          By {author}
        </Text>
        <Spacer />
        <Text fontWeight="bold" fontSize="sm">
          {amountOfSongs} songs
        </Text>
      </Flex>
    </Card>
  );
}
