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
import React from 'react';
import { AiOutlineHeart, AiOutlineDownload } from 'react-icons/ai';
import { FiChevronsUp } from 'react-icons/fi';
import {
  MdPlayArrow,
  MdPause,
  MdRepeat,
  MdShuffle,
  MdVolumeUp,
  MdSkipPrevious,
  MdSkipNext,
} from 'react-icons/md';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAudioPlayer, useAudioPosition } from 'react-use-audio-player';

import { Link } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
import { theme } from '@/stitches.config.js';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useQueueStore } from '@/stores/useQueueStore';

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
  const [queue, remove] = useQueueStore((s) => [s.queue, s.remove]);
  // const unsub = useQueueStore.subscribe(
  //   (s) => s.queue,
  //   (queue) => console.log('sub!', queue)
  // );

  const { pathname } = useLocation();
  const { togglePlayPause, error, loading, volume, playing, ready } = useAudioPlayer({
    autoplay: false,
    src: `${PATH}/static/song/7a73b245f63d6b41eee3c5cc428818325cb3cab1.mp3`,
    // src: `${PATH}/static/song/36f787caee409ce916a1da0fb276af1ecc1348a5.mp3`,
    html5: true,
    format: ['mp3'],
  });
  // const [controlsEnabled, setControlsEnabled] = useState(true);

  const handleDownload = () => {
    saveAs(`${PATH}/static/song/7a73b245f63d6b41eee3c5cc428818325cb3cab1.mp3`);
  };

  return (
    <Box sx={{ position: 'sticky', bottom: 0 }} zIndex={1} height="100px" overflow="hidden">
      {/* <button
        onClick={() => {
          remove(queue.getHeadNode().getData());
        }}
      >
        haha{' '}
      </button>
      <button
        style={{ marginLeft: '30px' }}
        onClick={() => {
          console.log('showing!', queue);
        }}
      >
        showing
      </button> */}
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
                  src="/assets/images/static-queue-ztd.jpg"
                  width="100px"
                  height="100px"
                  _hover={{
                    cursor: 'pointer',
                  }}
                />
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
              </Box>
            </Tooltip>
          )}
          <Flex flexFlow="column" justify="center" margin="0 10px" height="100px">
            <Box>
              <Text color={theme.colors.accentSolid.value} fontSize="sm" fontWeight="bold">
                Morphogenetic Sorrow
              </Text>

              <Text {...SONG_DATA_PROPS}>
                De:{' '}
                <Link variant="gray" to="/artist/shinji-hosoe" underline={false}>
                  Shinji Hosoe
                </Link>
              </Text>

              <Text {...SONG_DATA_PROPS}>
                Album: <Highlight>Zero Escape Official OST</Highlight>
              </Text>
            </Box>
          </Flex>

          <Spacer />

          <Divider {...DIVIDER_PROPS} margin="20px 2px" />
        </Flex>

        <SimpleGrid width="700px">
          <Flex justify="center" marginBottom="5px">
            <IconButton icon={MdShuffle} size="sm" />
            <IconButton icon={MdSkipPrevious} size="md" marginLeft="5px" />

            <ChakraIconButton
              bg="whiteAlpha.900"
              borderRadius="50%"
              marginLeft="5px"
              marginRight="5px"
              onClick={
                ready
                  ? togglePlayPause
                  : () => {
                      if (error) {
                        addNotification({
                          title: 'Error',
                          status: 'error',
                          message: 'No pudimos reproducir la canción, intentalo de nuevo luego',
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

            <IconButton icon={MdSkipNext} size="md" marginRight="5px" />
            <IconButton icon={MdRepeat} size="sm" />
          </Flex>

          <ProgressBar />
        </SimpleGrid>

        <Flex margin="0 auto" align="center" width="320px">
          <IconButton
            icon={AiOutlineDownload}
            size="md"
            marginLeft="15px"
            onClick={handleDownload}
          />
          <IconButton icon={AiOutlineHeart} size="md" marginRight="20px" />
          <Slider
            colorScheme="pink"
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

function IconButton({ icon, size, ...extraStyles }) {
  return (
    <ChakraIconButton
      variant="ghost"
      icon={
        <Icon
          as={icon}
          w={iconButtonSizes[size].w}
          h={iconButtonSizes[size].h}
          color="whiteAlpha.800"
          _hover={{
            color: 'whiteAlpha.700',
          }}
          _active={{
            color: theme.colors.accentSolidActive.value,
          }}
        />
      }
      _hover={{
        bg: 'transparent',
      }}
      _active={{
        bg: 'transparent',
      }}
      {...extraStyles}
    />
  );
}

function ProgressBar() {
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
