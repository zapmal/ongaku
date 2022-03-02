import { Badge, Flex, Spacer, Text } from '@chakra-ui/react';
import React from 'react';

import { Card } from './index';

import { Link } from '@/components/Elements';
import { theme } from '@/stitches.config.js';
import { getLink } from '@/utils/getLink';

export function SongCard({ id, cover, name, isExplicit, type, authors, isLiked, year }) {
  return (
    <Card cover={cover} type="song" id={id} isLiked={isLiked} to={name}>
      <Flex justify="end">
        <Text fontWeight="bold" wordBreak="break-word">
          {name}
        </Text>
        <Spacer />
        <Badge marginTop="5px" marginRight="5px" height="100%">
          {year}
        </Badge>
        {isExplicit && (
          <Badge
            marginTop="5px"
            marginRight="5px"
            height="100%"
            bg={theme.colors.dangerSolid.value}
            color="whiteAlpha.900"
          >
            E
          </Badge>
        )}
        <Badge
          marginTop="5px"
          color="whiteAlpha.900"
          bg={theme.colors.accentSolid.value}
          position="absolute"
          top={1}
          left={1}
        >
          {type}
        </Badge>
      </Flex>
      <Text color="whiteAlpha.700" fontSize="sm">
        {authors.split(',').map((author, index) => {
          const [linkText, authorLink] = getLink(author, authors);

          return (
            <Link to={`/artist/${authorLink}`} key={index} underline={false} variant="gray">
              {linkText}
            </Link>
          );
        })}
      </Text>
    </Card>
  );
}
