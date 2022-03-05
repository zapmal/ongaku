import {
  Tooltip,
  IconButton as ChakraIconButton,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItem,
  MenuDivider,
  Flex,
  Image,
  Text,
  Spacer,
  Badge,
  Box,
} from '@chakra-ui/react';
import React from 'react';
import { IoMdHeartEmpty, IoMdRemoveCircleOutline } from 'react-icons/io';
import { MdMoreVert, MdPlayArrow, MdPause } from 'react-icons/md';

import { MENU_ITEM_PROPS, FADE_OUT_ANIMATION } from '../constants';
import { useHover } from '../hooks/useHover';

import { Link } from '@/components/Elements';
import { theme } from '@/stitches.config.js';
import { getLink } from '@/utils/getLink';

export function SongRow({
  name,
  cover,
  isExplicit,
  authors,
  albumName,
  year,
  duration,
  width = '75%',
}) {
  const [isHovered, mouseEventsHandlers] = useHover();

  return (
    <Flex align="center" margin="15px 0" width={width} {...mouseEventsHandlers}>
      {isHovered ? (
        <Box animation={FADE_OUT_ANIMATION}>
          <IconButton icon={MdPlayArrow} size="lg" w="40px" h="40px" />
        </Box>
      ) : (
        <Image src={cover} w="60px" h="60px" borderRadius="5px" />
      )}

      <SongInformation
        name={name}
        isExplicit={isExplicit}
        authors={authors}
        albumName={albumName}
        year={year}
      />

      <Options isHovered={isHovered} duration={duration} isLarge={true} />
    </Flex>
  );
}

export function SongInQueue({ isPlaying, itemNumber, name, authors, duration, isExplicit }) {
  const [isHovered, mouseEventsHandlers] = useHover();

  return (
    <Flex align="center" margin="10px 0" {...mouseEventsHandlers}>
      {isPlaying || isHovered ? (
        <Box animation={FADE_OUT_ANIMATION}>
          <IconButton icon={isPlaying ? MdPause : MdPlayArrow} w="20px" h="20px" />
        </Box>
      ) : (
        <Text color="whiteAlpha.700" width="20px" margin="5px 6.1px" textAlign="center">
          {itemNumber}
        </Text>
      )}

      <SongInformation
        name={name}
        isPlaying={isPlaying}
        isExplicit={isExplicit}
        authors={authors}
      />

      <Options isHovered={isHovered} duration={duration} />
    </Flex>
  );
}

function SongInformation({ name, isPlaying, isExplicit, authors, albumName, year }) {
  return (
    <>
      <Box marginLeft="10px" textAlign="left">
        <Text color={isPlaying || albumName ? theme.colors.accentText.value : 'whiteAlpha.800'}>
          {name}{' '}
          {isExplicit && (
            <Badge bg={theme.colors.dangerSolid.value} color="whiteAlpha.900">
              E
            </Badge>
          )}
        </Text>
        <Text fontSize="xs" color={theme.colors.primaryText.value}>
          {authors.split(',').map((a, index) => {
            const [linkText, authorPath] = getLink(a, authors);
            return (
              <Link to={`/artist/${authorPath}`} key={index} underline={false} variant="gray">
                {linkText}
              </Link>
            );
          })}
          {albumName &&
            albumName.split(',').map((a, index) => {
              const [linkText, authorPath] = getLink(a, albumName);
              return (
                <React.Fragment key={index}>
                  {' - '}
                  <Link to={`/view/${authorPath}`} underline={false} variant="gray">
                    {linkText}
                  </Link>
                  {' - '}
                </React.Fragment>
              );
            })}
          {year}
        </Text>
      </Box>

      <Spacer />
    </>
  );
}

export function Options({ isHovered, duration, isLarge = false, onlyHeart = false }) {
  return (
    <>
      {isHovered && (
        <Box animation={FADE_OUT_ANIMATION} textAlign="left">
          {!onlyHeart && (
            <>
              <OptionMenu isLarge={isLarge} />
              <Option icon={IoMdHeartEmpty} isLarge={isLarge} />
            </>
          )}
        </Box>
      )}

      {onlyHeart && <Option icon={IoMdHeartEmpty} isLarge={isLarge} />}

      <Text
        color={theme.colors.primaryText.value}
        fontSize={isLarge ? 'md' : 'sm'}
        marginRight="5px"
        marginLeft={isLarge && '5px'}
      >
        {duration}
      </Text>
    </>
  );
}

const DIMENSIONS = {
  w: '25px',
  h: '25px',
};

export function IconButton({ icon, size = 'sm', w = DIMENSIONS.w, h = DIMENSIONS.h }) {
  const customSize = size !== 'sm' && { w: '60px', h: '60px' };
  return (
    <ChakraIconButton
      bg="whiteAlpha.900"
      borderRadius="50%"
      size={size}
      {...customSize}
      icon={<Icon as={icon} w={w} h={h} color={theme.colors.primaryBase.value} />}
    />
  );
}

export function Option({ icon, label, isLarge = false, ...styles }) {
  const dimensions = isLarge && { ...DIMENSIONS };
  const iconButton = (
    <ChakraIconButton
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

export function OptionMenu({ isLarge = false, ...styles }) {
  const dimensions = isLarge && { ...DIMENSIONS };
  return (
    <Menu isLazy placement="top-end" gutter={2} {...styles}>
      <MenuButton
        as={ChakraIconButton}
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
              Remover de la cola
            </MenuItem>
            <MenuDivider />
          </>
        )}

        <MenuOptionGroup title="Agregar a Playlist">
          <MenuItem {...MENU_ITEM_PROPS} fontSize="sm">
            Big Boi tunes
          </MenuItem>
          <MenuItem {...MENU_ITEM_PROPS} fontSize="sm">
            OnlyPain Official Soundtrack
          </MenuItem>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}
