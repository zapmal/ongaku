import { Box, Flex, Spacer, Button, Icon, Avatar, IconButton, Tooltip } from '@chakra-ui/react';
import React from 'react';
import {
  MdHome,
  MdLibraryMusic,
  MdOutlineExplore,
  MdSearch,
  MdGroups,
  MdHelp,
} from 'react-icons/md';
import { useLocation, Link } from 'react-router-dom';

import { theme } from '@/stitches.config.js';

export function NavigationBar() {
  const location = useLocation();
  // const [isSmallScreen, isMediumScreen] = useMediaQuery(['(max-width: 30em)', '(min-width: 48em)']);

  return (
    <Box bg="transparent" sx={{ position: 'sticky', top: 0 }} height={0} zIndex={1}>
      <Flex justify="center" align="center">
        <Avatar marginTop="10px" marginLeft="10px" size="lg" />
        <Spacer />
        {items.map((item, index) => (
          <Item
            key={index}
            text={item.text}
            icon={item.icon}
            to={item.to}
            isHighlighted={location.pathname === `/${item.text.toLowerCase()}`}
          />
        ))}
        <Spacer />
        <Tooltip label="For help, issues, or suggestions contact us via: official.ongaku@gmail.com">
          <IconButton
            variant="link"
            color="whiteAlpha.800"
            marginRight="10px"
            size="lg"
            icon={<MdHelp size={35} />}
            _active={{ color: 'whiteAlpha.700' }}
          />
        </Tooltip>
      </Flex>
    </Box>
  );
}

const items = [
  {
    text: 'Home',
    icon: MdHome,
    to: '/home',
  },
  {
    text: 'Library',
    icon: MdLibraryMusic,
    to: '/library',
  },
  {
    text: 'Explore',
    icon: MdOutlineExplore,
    to: '/explore',
  },
  {
    text: 'Search',
    icon: MdSearch,
    to: '/search',
  },
  {
    text: 'Rooms',
    icon: MdGroups,
    to: '/rooms',
  },
];

function Item({ text, icon, to, isHighlighted }) {
  return (
    <Button
      variant="link"
      fontSize="xl"
      margin="20px 0"
      as={Link}
      to={to}
      color={isHighlighted ? theme.colors.accentText.value : 'whiteAlpha.800'}
      textDecoration={isHighlighted && 'underline'}
      marginLeft={text !== 'Home' && '20px'}
      marginRight={text !== 'Rooms' && '20px'}
      _hover={{
        color: theme.colors.accentSolidHover.value,
      }}
      _active={{
        color: theme.colors.accentSolidActive.value,
      }}
      leftIcon={<Icon as={icon} w="25px" h="25px" />}
    >
      {text}
    </Button>
  );
}
