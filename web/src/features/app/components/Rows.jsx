import {
  Box,
  Avatar,
  Flex,
  Heading,
  Spacer,
  Badge,
  Icon,
  Text,
  Tooltip,
  IconButton,
  Image,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
// eslint-disable-next-line no-unused-vars
import { es } from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import { MdShare, MdAdd, MdPlayArrow, MdPause } from 'react-icons/md';
import { useAudioPlayer } from 'react-use-audio-player';

import { FADE_OUT_ANIMATION } from '../constants';
import { useHover } from '../hooks/useHover';

import { Options, IconButton as CustomIconButton } from './Song';

import { Link } from '@/components/Elements';
import { theme } from '@/stitches.config.js';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useQueueStore } from '@/stores/useQueueStore';
import { useRoomStore } from '@/stores/useRoomStore';
import { copyURL } from '@/utils/copyURL';
import { getLink } from '@/utils/getLink';

dayjs.extend(relativeTime);
dayjs.locale('es');

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
          {activeUsers} / {userLimit} Usuarios
        </Text>
      </Flex>

      <Box margin="5px 15px">
        <Text color="whiteAlpha.800" fontSize="xs">
          <Link to={`/user/${userProfileLink}`} underline={false}>
            {host}
          </Link>{' '}
          - Empezó hace {dayjs().from(startedAt, true)}.
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
            onClick={() => copyURL(`room/${roomId}`)}
          />
        </Flex>
      </Box>
    </Box>
  );
}

export function ArtistRow({ name, avatar, amountOfFollowers }) {
  // eslint-disable-next-line no-unused-vars
  const [_, artistLink] = getLink(name, name);
  const [isHovered, mouseEventsHandlers] = useHover();

  return (
    <Flex align="center" margin="13px 0" width="75%" {...mouseEventsHandlers}>
      <Avatar size="lg" transition="opacity 300ms ease-in-out" src={avatar} />
      <Box marginLeft="20px" textAlign="left">
        <Text
          color={theme.colors.accentText.value}
          fontSize="lg"
          underline={false}
          as={Link}
          to={`/artist/${artistLink}`}
        >
          {name}
        </Text>
        <Text color="whiteAlpha.700" fontSize="sm" textAlign="left">
          {amountOfFollowers} seguidores
        </Text>
      </Box>

      <Spacer />
      {isHovered && (
        <Box animation={FADE_OUT_ANIMATION}>
          <Tooltip label={`Sigue a ${name}`}>
            <IconButton
              icon={<Icon as={MdAdd} />}
              variant="outline"
              _hover={{
                color: 'whiteAlpha.800',
              }}
              _active={{
                color: theme.colors.accentSolidActive.value,
                borderColor: theme.colors.accentSolidActive.value,
              }}
            />
          </Tooltip>
        </Box>
      )}
    </Flex>
  );
}

export function AlbumRow({ id, name, cover, isExplicit, authors, songs, type, year }) {
  const [isHovered, mouseEventsHandlers] = useHover();
  return (
    <RowContainer
      isHovered={isHovered}
      cover={cover}
      mouseEventsHandlers={mouseEventsHandlers}
      songs={songs}
    >
      <Box marginLeft="10px" textAlign="left">
        <Text color={theme.colors.accentText.value}>
          <Link to={`/view?id=${id}&type=album`} underline={false} color="inherit">
            {name}
          </Link>{' '}
          {isExplicit && (
            <Badge bg={theme.colors.dangerSolid.value} color="whiteAlpha.900">
              E
            </Badge>
          )}
        </Text>

        <Flex gap="5px">
          <Text fontSize="xs" color={theme.colors.primaryText.value}>
            {authors.split(',').map((a, index) => {
              const [linkText, authorPath] = getLink(a, authors);
              return (
                <Link to={`/artist/${authorPath}`} key={index} underline={false} variant="gray">
                  {linkText}{' '}
                </Link>
              );
            })}
          </Text>
          <Text fontSize="xs" color={theme.colors.primaryText.value}>
            - {type} -
          </Text>
          <Text fontSize="xs" color={theme.colors.primaryText.value}>
            {year}
          </Text>
        </Flex>
      </Box>

      <Spacer />

      <Options isHovered={isHovered} duration="3:35" isLarge={true} />
    </RowContainer>
  );
}

export function PlaylistRow({ name, author, cover, amountOfSongs }) {
  const [isHovered, mouseEventsHandlers] = useHover();
  const [linkText, linkToUserProfile] = getLink(author, author);
  // eslint-disable-next-line no-unused-vars
  const [__, linkToPlaylist] = getLink(name, name);

  return (
    <RowContainer isHovered={isHovered} cover={cover} mouseEventsHandlers={mouseEventsHandlers}>
      <Box marginLeft="10px" textAlign="left">
        <Text color={theme.colors.accentText.value}>
          <Link to={`/view/${linkToPlaylist}`} underline={false} color="inherit">
            {name}
          </Link>
        </Text>

        <Flex gap="5px">
          <Text fontSize="xs" color={theme.colors.primaryText.value}>
            <Link to={`/user/${linkToUserProfile}`} underline={false} variant="gray">
              {linkText}{' '}
            </Link>
          </Text>
          <Text fontSize="xs" color={theme.colors.primaryText.value}>
            - {amountOfSongs} canciones
          </Text>
        </Flex>
      </Box>

      <Spacer />

      <Options isHovered={isHovered} isLarge={true} onlyHeart={true} />
    </RowContainer>
  );
}

function RowContainer({ isHovered, cover, mouseEventsHandlers, songs, children }) {
  const store = useQueueStore();

  const { playing, togglePlayPause, error, ready } = useAudioPlayer();

  const room = useRoomStore((s) => s.room);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const handleIsPlaying = () => {
    if (ready) {
      togglePlayPause();
    } else {
      if (error) {
        addNotification({
          title: 'Error',
          status: 'error',
          message: 'No pudimos reproducir la canción, intentalo de nuevo luego',
        });
      }
    }
  };

  const handlePlay = () => {
    if (songs.length !== 0 && room.length === 0) store.add(songs);
  };

  console.log('hello', songs);
  console.log(store.currentlyPlaying.id === store.queue.getHeadNode()?.getData().id);
  console.log(store.currentlyPlaying);

  return (
    <Flex align="center" margin="15px 0" width="75%" {...mouseEventsHandlers}>
      {isHovered ? (
        <Box animation={FADE_OUT_ANIMATION} onClick={handlePlay}>
          <CustomIconButton
            icon={playing ? MdPause : MdPlayArrow}
            size="lg"
            w="40px"
            h="40px"
            onClick={
              store.currentlyPlaying.id === store.queue.getHeadNode()?.getData().id
                ? handleIsPlaying
                : handlePlay
            }
          />
        </Box>
      ) : (
        <Image src={cover} w="60px" h="60px" borderRadius="5px" />
      )}
      {children}
    </Flex>
  );
}
