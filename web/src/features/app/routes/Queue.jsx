import {
  SimpleGrid,
  Tooltip,
  Image,
  Box,
  Text,
  Flex,
  IconButton,
  Spacer,
  Icon,
  Divider,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaScroll } from 'react-icons/fa';
import { IoMdHeartEmpty, IoMdMicrophone, IoMdRemoveCircleOutline } from 'react-icons/io';
import { MdPlayArrow, MdPause, MdMoreVert } from 'react-icons/md';

import { FADE_OUT_ANIMATION, MENU_ITEM_PROPS, SONGS_IN_QUEUE } from '../constants';
import { useHover } from '../hooks/useHover';

import { Link } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
import { theme } from '@/stitches.config.js';
import { getSongAuthorPage } from '@/utils/getSongAuthorPage';

export function Queue() {
  return (
    <SimpleGrid columns={2} align="space-evenly" margin="80px 50px 0 50px" position="relative">
      <Box width="550px">
        <Image
          src="/assets/images/static-queue-ztd.jpg"
          width="inherit"
          height="400px"
          borderRadius="5px"
          sx={{ position: 'fixed', top: 20 }}
        />
        <Box margin="10px" position="fixed" bottom="100px" left="210px">
          <OptionButton
            icon={AiOutlinePlus}
            isLarge={true}
            label="Add to playlist"
            marginRight="40px"
          />
          <OptionButton
            icon={IoMdMicrophone}
            isLarge={true}
            label="Show Lyrics"
            marginRight="40px"
          />
          <OptionMenuButton isLarge={true} />
        </Box>
      </Box>

      <Box>
        <Text color="whiteAlpha.700" marginBottom="10px">
          <Highlight>Queue</Highlight> · 10 songs · 37 min 45 sec
        </Text>
        <Divider />

        {SONGS_IN_QUEUE.map((song, index) => (
          <div key={index}>
            <QueueItem
              name={song.name}
              author={song.author}
              duration={song.duration}
              itemNumber={index + 1}
              isPlaying={index === 0}
              isExplicit={song.isExplicit}
            />

            {SONGS_IN_QUEUE.length !== index + 1 && <Divider />}
          </div>
        ))}
      </Box>
    </SimpleGrid>
  );
}

function QueueItem({ isPlaying, itemNumber, name, author, duration, isExplicit }) {
  const [isHovered, mouseEventsHandlers] = useHover();

  return (
    <Flex align="center" margin="10px 0" {...mouseEventsHandlers}>
      {isPlaying || isHovered ? (
        <Box animation={FADE_OUT_ANIMATION}>
          <ActionButton icon={isPlaying ? MdPause : MdPlayArrow} />
        </Box>
      ) : (
        <Text color="whiteAlpha.700" width="20px" margin="5px 6.1px" textAlign="center">
          {itemNumber}
        </Text>
      )}
      <Box marginLeft="10px">
        <Text color={isPlaying ? theme.colors.accentText.value : 'whiteAlpha.700'}>
          {name}{' '}
          {isExplicit && (
            <Badge bg={theme.colors.dangerSolid.value} color="whiteAlpha.900">
              E
            </Badge>
          )}
        </Text>
        <Text fontSize="xs" color="whiteAlpha.800">
          {author.split(',').map((a, index) => {
            const [linkText, authorPath] = getSongAuthorPage(a, author);
            return (
              <Link to={`/artist/${authorPath}`} key={index} underline={false} variant="gray">
                {linkText}
              </Link>
            );
          })}
        </Text>
      </Box>
      <Spacer />

      {isHovered && (
        <Box animation={FADE_OUT_ANIMATION}>
          {!isPlaying && <OptionMenuButton />}
          <OptionButton icon={IoMdHeartEmpty} />
        </Box>
      )}
      <Text display="inline" color="whiteAlpha.800" fontSize="sm" marginRight="5px">
        {duration}
      </Text>
    </Flex>
  );
}

function ActionButton({ icon }) {
  return (
    <IconButton
      bg="whiteAlpha.900"
      borderRadius="50%"
      size="sm"
      icon={<Icon as={icon} w="20px" h="20px" color={theme.colors.primaryBase.value} />}
    />
  );
}

const DIMENSIONS = {
  w: '25px',
  h: '25px',
};

function OptionButton({ icon, label, isLarge = false, ...styles }) {
  const dimensions = isLarge && { ...DIMENSIONS };
  const iconButton = (
    <IconButton
      {...styles}
      variant="ghost"
      icon={<Icon as={icon} {...dimensions} />}
      _hover={{
        color: theme.colors.accentSolidHover.value,
      }}
      _active={{
        color: theme.colors.accentSolidActive.value,
      }}
    />
  );

  return label ? <Tooltip label={label}>{iconButton}</Tooltip> : iconButton;
}

function OptionMenuButton({ isLarge = false, ...styles }) {
  const dimensions = isLarge && { ...DIMENSIONS };
  return (
    <Menu isLazy placement="top-end" gutter={2} {...styles}>
      <MenuButton
        as={IconButton}
        variant="ghost"
        icon={<Icon as={MdMoreVert} {...dimensions} />}
        _hover={{
          color: theme.colors.accentSolidHover.value,
        }}
        _active={{
          color: theme.colors.accentSolidActive.value,
        }}
      />
      <MenuList bg={theme.colors.primaryBase.value}>
        {/* Big one is currently playing, so no need to remove from queue */}
        {!isLarge && (
          <>
            <MenuItem
              {...MENU_ITEM_PROPS}
              icon={<Icon as={IoMdRemoveCircleOutline} w="15px" h="15px" marginTop="5px" />}
            >
              Remove from queue
            </MenuItem>
            <MenuDivider />
          </>
        )}

        <MenuOptionGroup title="Add to playlist">
          <MenuItem {...MENU_ITEM_PROPS} fontSize="sm">
            Big Boi tunes
          </MenuItem>
          <MenuItem {...MENU_ITEM_PROPS} fontSize="sm">
            OnlyPain Official Soundtrack
          </MenuItem>
        </MenuOptionGroup>

        <MenuDivider />

        <MenuItem
          {...MENU_ITEM_PROPS}
          icon={<Icon as={FaScroll} w="15px" h="15px" marginTop="5px" />}
        >
          Show credits
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
