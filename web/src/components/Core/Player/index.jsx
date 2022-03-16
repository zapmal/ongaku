import {
  Box,
  Flex,
  Image,
  SimpleGrid,
  Text,
  Divider,
  Spacer,
  IconButton as ChakraIconButton,
  Icon,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  Spinner,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import { AiOutlineHeart, AiFillHeart, AiOutlineDownload } from 'react-icons/ai';
import { FiChevronsUp } from 'react-icons/fi';
import {
  MdPlayArrow,
  MdPause,
  MdRepeat,
  MdVolumeUp,
  MdSkipPrevious,
  MdSkipNext,
  MdShuffle,
} from 'react-icons/md';
import { useMutation } from 'react-query';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAudioPlayer, useAudioPosition } from 'react-use-audio-player';

import { Link } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
import { likeSong } from '@/features/app';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useQueueStore } from '@/stores/useQueueStore';
import { useRoomStore } from '@/stores/useRoomStore';
import { getImage } from '@/utils/getImage';
import { getName } from '@/utils/getName';

dayjs.extend(duration);

const DIVIDER_PROPS = {
  orientation: 'vertical',
  h: '60px',
};
const SONG_DATA_PROPS = {
  fontSize: 'xs',
  color: 'whiteAlpha.800',
};

const PATH = import.meta.env.VITE_NODE_API_URL;

export function Player() {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const entity = useAuthStore((s) => s.entity);
  const store = useQueueStore();
  const room = useRoomStore((s) => s.room);

  const [controlsEnabled, setControlsEnabled] = useState(store.queue.isEmpty());
  const [isLiked, setLiked] = useState(
    store.currentlyPlaying.interaction?.length !== 0
      ? store.currentlyPlaying.interaction[0]?.value
      : false
  );
  const [shouldRepeat, setRepeat] = useState(false);

  const { pathname } = useLocation();
  const { togglePlayPause, error, loading, volume, playing, ready, ended, play } = useAudioPlayer({
    autoplay: false,
    src: `${PATH}/static/song/${store.currentlyPlaying?.path}`,
    html5: true,
    format: ['mp3'],
  });

  useEffect(() => {
    if (ended) {
      const currentlyPlayingNode = store.queue.find(store.currentlyPlaying);

      if (currentlyPlayingNode.next) {
        store.setCurrentlyPlaying(currentlyPlayingNode.next.data);
      } else if (
        store.queue.getHeadNode() &&
        store.queue.getHeadNode().getData() !== currentlyPlayingNode.getData()
      ) {
        store.setCurrentlyPlaying(store.queue.getHeadNode().getData());
      } else {
        store.setCurrentlyPlaying({ artist: {}, album: {}, interaction: [] });
        store.removeHeadNode();
        setLiked(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ended]);

  const handleDownload = () => {
    saveAs(`${PATH}/static/song/${store.currentlyPlaying.path}`);
  };

  const likeMutation = useMutation(likeSong);

  const handleLike = async (songId) => {
    try {
      await likeMutation.mutateAsync({ songId });
      setLiked(!isLiked);
    } catch (error) {
      console.log('Error al intentar remover', error);
    }
  };

  useEffect(() => {
    setControlsEnabled(store.queue.isEmpty());
    setLiked(
      store.currentlyPlaying.interaction?.length !== 0
        ? store.currentlyPlaying.interaction[0]?.value
        : false
    );

    if (ended && shouldRepeat) {
      play();
    }
  }, [shouldRepeat, store, ended, play]);

  return (
    <Box sx={{ position: 'sticky', bottom: 0 }} zIndex={1} height="100px" overflow="hidden">
      <Flex
        align="center"
        bg={theme.colors.primaryBase.value}
        borderTop={`.5px solid ${theme.colors.primaryLine.value}`}
      >
        <Flex width="300px">
          {pathname !== '/queue' && (
            <Tooltip label="Haz click para ir a la cola">
              <Box as={RouterLink} to="/queue">
                <Image
                  src={getImage('album', store.currentlyPlaying.cover, 'default/default_album.png')}
                  width="100px"
                  height="100px"
                  _hover={{
                    cursor: 'pointer',
                  }}
                />
                {store.currentlyPlaying.cover && (
                  <Icon
                    transition="all 300ms ease-in"
                    as={FiChevronsUp}
                    w="25px"
                    h="25px"
                    position="absolute"
                    left="70px"
                    top="5px"
                    _hover={{
                      color: theme.colors.accentSolidHover.value,
                      cursor: 'pointer',
                      transform: 'scale(1.2)',
                    }}
                  />
                )}
              </Box>
            </Tooltip>
          )}
          <Flex flexFlow="column" justify="center" margin="0 10px" height="100px">
            {!store.queue.isEmpty() ? (
              <Box>
                <Text color={theme.colors.accentSolid.value} fontSize="sm" fontWeight="bold">
                  {store.currentlyPlaying?.name}
                </Text>

                <Text {...SONG_DATA_PROPS}>
                  De:{' '}
                  <Link
                    variant="gray"
                    to={`/artist/${
                      store.currentlyPlaying?.artist?.artisticName
                        ? store.currentlyPlaying?.artist.artisticName
                        : store.currentlyPlaying?.artist?.band?.name
                    }`}
                    underline={false}
                  >
                    {getName(
                      store.currentlyPlaying?.artist.artisticName
                        ? store.currentlyPlaying.artist.artisticName
                        : store.currentlyPlaying.artist?.band?.name
                    )}
                  </Link>
                </Text>

                <Text {...SONG_DATA_PROPS}>
                  Album:{' '}
                  {store.currentlyPlaying?.album?.name && (
                    <Highlight>{store.currentlyPlaying.album.name}</Highlight>
                  )}
                </Text>
              </Box>
            ) : (
              <Box>
                <Text fontSize="sm">No hay nada en cola</Text>
                <Text fontSize="sm" fontWeight="bold" color={theme.colors.accentSolid.value}>
                  Por ahora {';)'}
                </Text>
              </Box>
            )}
          </Flex>

          <Spacer />

          <Divider {...DIVIDER_PROPS} margin="20px 2px" />
        </Flex>

        <SimpleGrid width="700px">
          <Flex justify="center" marginBottom="5px">
            <IconButton
              icon={MdShuffle}
              isDisabled={controlsEnabled}
              onClick={store.shuffle}
              size="sm"
            />
            <IconButton
              icon={MdSkipPrevious}
              isDisabled={
                controlsEnabled ||
                (!store.queue.isEmpty() && !store.queue.find(store.currentlyPlaying).prev) ||
                shouldRepeat
              }
              onClick={() => {
                const prev = store.queue.find(store.currentlyPlaying).prev;
                store.setCurrentlyPlaying(prev.data);
                setLiked(
                  prev.data.interaction?.length !== 0 ? prev.data.interaction[0].value : false
                );
              }}
              size="md"
              marginLeft="5px"
            />

            <ChakraIconButton
              bg="whiteAlpha.900"
              borderRadius="50%"
              marginLeft="5px"
              marginRight="5px"
              isDisabled={controlsEnabled}
              onClick={
                ready
                  ? togglePlayPause
                  : () => {
                      if (error) {
                        setTimeout(() => {
                          store.remove(store.currentlyPlaying);
                        }, 3000);
                        addNotification({
                          title: 'Error',
                          status: 'error',
                          message:
                            'No pudimos reproducir la canción, se removerá de la cola. Intentalo de nuevo luego',
                        });
                      }
                    }
              }
              icon={
                loading ? (
                  <Spinner color="black" />
                ) : (
                  <Icon
                    as={playing ? MdPause : MdPlayArrow}
                    w="30px"
                    h="30px"
                    color={theme.colors.primaryBase.value}
                  />
                )
              }
            />

            <IconButton
              icon={MdSkipNext}
              isDisabled={
                controlsEnabled ||
                (!store.queue.isEmpty() && !store.queue.find(store.currentlyPlaying).next) ||
                shouldRepeat
              }
              onClick={() => {
                if (store.currentlyPlaying === store.queue.getHeadNode().getData()) {
                  store.removeHeadNode();
                  store.setCurrentlyPlaying(store.queue.getHeadNode().getData());

                  setLiked(
                    store.queue.getHeadNode().getData().interaction?.length !== 0
                      ? store.queue.getHeadNode().getData().interaction[0].value
                      : false
                  );
                } else {
                  const currentlyPlaying = store.queue.find(store.currentlyPlaying);
                  store.setCurrentlyPlaying(currentlyPlaying.next.data);
                  store.queue.removeNode(store.queue.find(store.currentlyPlaying).getData());

                  setLiked(
                    currentlyPlaying.next.data.interaction?.length !== 0
                      ? currentlyPlaying.next.data.inteaction.value
                      : false
                  );
                }
              }}
              size="md"
              marginRight="5px"
            />
            <IconButton
              icon={MdRepeat}
              isDisabled={controlsEnabled}
              backgroundColor={shouldRepeat && theme.colors.accentSolid.value}
              transparentOnAction={false}
              onClick={() => setRepeat(!shouldRepeat)}
              size="sm"
            />
          </Flex>

          <ProgressBar controlsEnabled={controlsEnabled} />
        </SimpleGrid>

        <Flex margin="0 auto" align="center" width="320px">
          <IconButton
            icon={AiOutlineDownload}
            isDisabled={controlsEnabled}
            onClick={handleDownload}
            size="md"
            marginLeft="15px"
            marginRight={entity.role === 'USER' ? 0 : '20px'}
          />
          {entity.role === 'USER' &&
            (room.length === 0 ? (
              <IconButton
                icon={isLiked ? AiFillHeart : AiOutlineHeart}
                isLiked={isLiked}
                onClick={() => {
                  handleLike(store.currentlyPlaying.id);
                }}
                isDisabled={controlsEnabled || likeMutation.isLoading}
                size="md"
                marginRight="20px"
              />
            ) : (
              <Tooltip label="Esta función está deshabilitada al estar en una sala">
                <span>
                  <Icon
                    as={AiOutlineHeart}
                    w="25px"
                    h="25px"
                    marginRight="15px"
                    marginTop="5px"
                    color="whiteAlpha.300"
                  />
                </span>
              </Tooltip>
            ))}
          <Slider
            colorScheme="pink"
            isDisabled={controlsEnabled}
            onChangeEnd={(v) => volume(v / 100)}
            defaultValue={() => {
              volume(1);
              return 100;
            }}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Icon as={MdVolumeUp} w="20px" h="20px" color="whiteAlpha.800" margin="0 15px" />
        </Flex>
      </Flex>
    </Box>
  );
}

const iconButtonSizes = {
  sm: {
    w: '20px',
    h: '20px',
  },
  md: {
    w: '25px',
    h: '25px',
  },
};

function IconButton({ icon, size, transparentOnAction = true, isLiked, ...extraStyles }) {
  const shouldGoTransparent = transparentOnAction
    ? {
        _hover: { bg: 'transparent' },
        _active: {
          bg: 'transparent',
        },
      }
    : {
        _hover: { bg: theme.colors.accentSolidHover.value },
        _active: { bg: theme.colors.accentSolidActive.value },
      };

  return (
    <ChakraIconButton
      variant="ghost"
      icon={
        <Icon
          as={icon}
          w={iconButtonSizes[size].w}
          h={iconButtonSizes[size].h}
          color={isLiked ? theme.colors.accentSolid.value : 'whiteAlpha.800'}
          _hover={{
            color: isLiked ? theme.colors.accentSolidHover.value : 'whiteAlpha.700',
          }}
          _active={{
            color: transparentOnAction ? theme.colors.accentSolidActive.value : 'white',
          }}
        />
      }
      {...shouldGoTransparent}
      {...extraStyles}
    />
  );
}

function ProgressBar({ controlsEnabled }) {
  const { percentComplete, duration, seek, position } = useAudioPosition({ highRefreshRate: true });

  const goToPosition = React.useCallback(
    (percentage) => {
      seek(duration * percentage);
    },
    [duration, seek]
  );

  return (
    <Flex align="center" height="25px">
      <Spacer />

      <Text marginRight="10px" fontSize="sm">
        {position !== 0
          ? Math.ceil(position % 60) < 10
            ? `${Math.floor(position / 60)}:0${Math.ceil(position % 60)}`
            : `${Math.floor(position / 60)}:${Math.ceil(position % 60)}`
          : '0:00'}
      </Text>

      <Slider
        name="progress"
        colorScheme="pink"
        width="450px"
        isDisabled={controlsEnabled}
        onChange={(v) => goToPosition(v / 100)}
        value={Math.round(percentComplete)}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>

      <Text marginLeft="10px" fontSize="sm">
        {duration !== 0 ? `${Math.floor(duration / 60)}:${Math.ceil(duration % 60)}` : '0:00'}
      </Text>

      <Spacer />

      <Divider {...DIVIDER_PROPS} marginBottom="42px" />
    </Flex>
  );
}
