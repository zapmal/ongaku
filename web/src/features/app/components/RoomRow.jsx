import { Box, Flex, Heading, Spacer, Badge, Icon, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import { MdShare } from 'react-icons/md';

import { Link } from '@/components/Elements';
import { theme } from '@/stitches.config.js';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { getLink } from '@/utils/getLink';

dayjs.extend(relativeTime);

export function RoomRow({ name, activeUsers, userLimit, host, startedAt, genres, roomId }) {
  const addNotification = useNotificationStore((s) => s.addNotification);
  // eslint-disable-next-line no-unused-vars
  const [_, userProfileLink] = getLink(host, host);

  return (
    <Box
      width="620px"
      height="95px"
      margin="0 20px 20px 20px"
      borderRadius="5px"
      backgroundColor={theme.colors.primaryBg.value}
    >
      <Flex margin="10px 15px 0 15px" align="center">
        <Heading
          fontSize="xl"
          as={Link}
          to={`/room/${roomId}`}
          underline={false}
          _hover={{
            color: theme.colors.accentText.value,
          }}
        >
          {name}
        </Heading>

        <Spacer />

        <Badge
          backgroundColor={theme.colors.dangerSolid.value}
          marginRight="10px"
          width="10px"
          height="10px"
          borderRadius="100%"
        />
        <Text fontSize="sm" color="whiteAlpha.700" fontWeight="bold">
          {activeUsers} / {userLimit} Users
        </Text>
      </Flex>

      <Box margin="5px 15px">
        <Text color="whiteAlpha.800" fontSize="xs">
          <Link to={`/user/${userProfileLink}`} underline={false}>
            {host}
          </Link>{' '}
          - Started {dayjs().from(startedAt, true)} ago.
        </Text>

        <Flex margin="10px 0" gap="10px">
          {genres.split(',').map((genre, index) => (
            <Badge
              key={index}
              fontSize="x-small"
              backgroundColor={theme.colors.accentSolid.value}
              color="whiteAlpha.900"
              height="100%"
            >
              {genre}
            </Badge>
          ))}

          <Spacer />

          <Icon
            as={MdShare}
            _hover={{ cursor: 'pointer' }}
            onClick={() => {
              navigator.clipboard.writeText(roomId);
              addNotification({
                title: 'Copied!',
                message: 'Room ID successfully copied to clipboard',
              });
            }}
          />
        </Flex>
      </Box>
    </Box>
  );
}
