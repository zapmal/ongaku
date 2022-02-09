/* eslint-disable jsx-a11y/aria-role */
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Divider,
  Avatar,
  Spacer,
  Flex,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import React from 'react';
import { MdExitToApp } from 'react-icons/md';

import { SongInQueue } from '../../components';
import { FADE_OUT_ANIMATION, SONGS_IN_QUEUE, USERS_IN_ROOM } from '../../constants';
import { useHover } from '../../hooks/useHover';

import { Link, Button } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
import { theme } from '@/stitches.config.js';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { getLink } from '@/utils/getLink';

/**
 * This should receive multiple parameters later on when it gets functional, including
 * the room ID.
 */
export function Room() {
  const addNotification = useNotificationStore((s) => s.addNotification);

  return (
    <Box padding="20px 60px">
      <Flex gap="80px">
        <Box width="80%">
          <Heading>Perreo Intenso</Heading>

          <Text color="whiteAlpha.800" margin="10px 0">
            <Highlight>Queue</Highlight> · 10 songs · 37 min 45 sec
          </Text>

          <Divider />

          {SONGS_IN_QUEUE.map((song, index) => (
            <div key={index}>
              <SongInQueue
                name={song.name}
                authors={song.authors}
                duration={song.duration}
                itemNumber={index + 1}
                isPlaying={index === 0}
                isExplicit={song.isExplicit}
              />

              {SONGS_IN_QUEUE.length !== index + 1 && <Divider />}
            </div>
          ))}
        </Box>

        <Box width="80%">
          <Flex align="center">
            <Heading>Users</Heading>
            <Spacer />
            <Button margin="0 10px" variant="danger">
              Close Room
            </Button>
            <Button
              onClick={() => {
                // this should use the env var.
                navigator.clipboard.writeText('http://localhost:3000/room/BX3A-ASS1');
                addNotification({
                  title: 'Copied!',
                  message: 'Room link successfully copied to clipboard',
                });
              }}
            >
              Invite
            </Button>
          </Flex>

          <Text color="whiteAlpha.800" margin="10px 0">
            Room is full · <Highlight>6/6 users</Highlight>
          </Text>

          <Divider />

          <SimpleGrid columns={3} margin="10px 0">
            {USERS_IN_ROOM.map((user, index) => (
              <User
                key={index}
                name={user.name}
                role={user.role}
                profilePicture={user.profilePicture}
              />
            ))}
          </SimpleGrid>
        </Box>
      </Flex>
    </Box>
  );
}

function User({ profilePicture, role, name }) {
  // eslint-disable-next-line no-unused-vars
  const [_, profileLink] = getLink(name, name);
  const [isHovered, mouseEventsHandlers] = useHover();

  return (
    <Flex align="center" flexDir="column" margin="10px 0">
      <Avatar
        {...mouseEventsHandlers}
        size="xl"
        src={profilePicture}
        opacity={isHovered && 0.6}
        transition="opacity 150ms ease-in"
        _hover={{ cursor: 'pointer' }}
        border={`3px solid ${theme.colors.successSolid.value}`}
      />
      {isHovered && (
        <Box
          animation={FADE_OUT_ANIMATION}
          textAlign="left"
          position="relative"
          {...mouseEventsHandlers}
        >
          <IconButton
            icon={<Icon as={MdExitToApp} w="20px" h="20px" />}
            position="absolute"
            bottom="25px"
            left="-20px"
            backgroundColor={theme.colors.dangerSolid.value}
            _hover={{
              backgroundColor: theme.colors.dangerSolidHover.value,
            }}
            _active={{
              backgroundColor: theme.colors.dangerSolidActive.value,
            }}
          />
        </Box>
      )}
      <Text fontSize="xs" color="whiteAlpha.700" fontWeight="bold">
        {role}
      </Text>
      <Text fontWeight="bold" as={Link} to={`/user/${profileLink}`} underline={false}>
        {name}
      </Text>
    </Flex>
  );
}
