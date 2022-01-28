import { Box, Heading, Text, Badge, Flex, Spacer, IconButton, Icon } from '@chakra-ui/react';
import React from 'react';
import { MdFullscreen, MdClose } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';

import { Link } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
import { theme } from '@/stitches.config.js';
import { getLink } from '@/utils/getLink';

export function CurrentRoomOverlay({ name, host, activeUsers, userLimit, roomId }) {
  // eslint-disable-next-line no-unused-vars
  const [_, userProfileLink] = getLink(host, host);

  return (
    <Box
      sx={{ position: 'sticky', bottom: '120px' }}
      bg={theme.colors.primaryBase.value}
      border={`.5px solid ${theme.colors.primaryLine.value}`}
      borderRadius="5px"
      zIndex={2}
      width="250px"
      margin="10px"
      height="100%"
    >
      <Box margin="10px">
        <Heading fontSize="xl">
          <Highlight>Listening</Highlight> to {name}
        </Heading>
        <Flex align="center">
          <Text color="whiteAlpha.800" fontSize="sm" margin="10px 0">
            <Link to={`/user/${userProfileLink}`} underline={false}>
              {host}
            </Link>{' '}
            room
          </Text>

          <Spacer />

          <Badge
            backgroundColor={theme.colors.dangerSolid.value}
            marginRight="10px"
            width="10px"
            height="10px"
            borderRadius="100%"
          />
          <Text fontSize="sm" color="whiteAlpha.700">
            {activeUsers} / {userLimit} Users
          </Text>
        </Flex>

        <IconButton
          icon={<Icon as={MdFullscreen} />}
          variant="outline"
          marginRight="10px"
          as={RouterLink}
          to={`/room/${roomId}`}
          _hover={{
            backgroundColor: theme.colors.accentSolidHover.value,
          }}
          _active={{
            backgroundColor: theme.colors.accentSolidActive.value,
          }}
        />
        <IconButton
          icon={<Icon as={MdClose} />}
          variant="outline"
          _hover={{
            backgroundColor: theme.colors.dangerSolidHover.value,
          }}
          _active={{
            backgroundColor: theme.colors.dangerSolidActive.value,
          }}
        />
      </Box>
    </Box>
  );
}
