import { Badge, Box, Flex, Spacer, Text } from '@chakra-ui/react';
import React from 'react';

import { Card } from './index';

import { Link } from '@/components/Elements';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';
import { getImage } from '@/utils/getImage';

export function PlaylistCard({
  id,
  cover,
  name,
  likes,
  amountOfSongs,
  author,
  isLiked,
  notLikeable = false,
  badge = true,
}) {
  return (
    <Card
      cover={cover}
      type="playlist"
      notLikeable={notLikeable}
      to={name}
      id={id}
      isLiked={isLiked}
    >
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
          {likes === 1 ? '1 like' : `${likes} likes`}
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
          {amountOfSongs === 1 ? '1 canción' : `${amountOfSongs} canciones`}
        </Text>
      </Flex>
    </Card>
  );
}

export function LikedSongsPlaylist() {
  const entity = useAuthStore((s) => s.entity);

  return (
    <Card
      cover={getImage('user', entity.avatar, 'default_avatar.svg')}
      type="playlist"
      notLikeable={true}
      isLikedSongsPlaylist={true}
    >
      <Box align="center">
        <Text fontWeight="bold">Canciones Favoritas</Text>
        <Text color="whiteAlpha.700" fontSize="xs">
          Playlist creada automáticamente.
        </Text>
      </Box>
    </Card>
  );
}
