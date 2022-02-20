import { Badge, Box, Flex, Spacer, Text } from '@chakra-ui/react';
import React from 'react';

import { Card } from './index';

import { Link } from '@/components/Elements';
import { theme } from '@/stitches.config.js';

export function PlaylistCard({ cover, name, likes, amountOfSongs, author, badge = true }) {
  return (
    <Card cover={cover} type="playlist">
      {badge && (
        <Badge marginTop="5px" position="absolute" top={1} left={1}>
          Playlist
        </Badge>
      )}
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
          <Link
            underline={false}
            variant="gray"
            to={`/user/${author.split(' ').join('-').toLowerCase()}`}
          >
            {author}
          </Link>
        </Text>
        <Spacer />
        <Text fontWeight="bold" fontSize="sm">
          {amountOfSongs} canciones
        </Text>
      </Flex>
    </Card>
  );
}

export function LikedSongsPlaylist() {
  return (
    <Card cover="/assets/images/static-admin-avatar.jpeg" type="playlist" isLikedPlaylist={true}>
      <Box align="center">
        <Text fontWeight="bold">Canciones Favoritas</Text>
        <Text color="whiteAlpha.700" fontSize="sm">
          200 canciones
        </Text>
      </Box>
    </Card>
  );
}
