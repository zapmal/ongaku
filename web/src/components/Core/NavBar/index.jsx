import { Box, Flex, Spacer, Button, Icon, IconButton, Tooltip } from '@chakra-ui/react';
import React, { useState, useEffect, useCallback } from 'react';
import {
  MdHome,
  MdLibraryMusic,
  MdOutlineExplore,
  MdGroups,
  MdHelp,
  MdSearch,
} from 'react-icons/md';
import { useLocation, Link as RouterLink } from 'react-router-dom';

import { ProfileIcon } from './ProfileIcon';
import { SearchBar } from './SearchBar';

import { GRADIENTS } from '@/features/app';
import { theme } from '@/stitches.config.js';

export function NavigationBar() {
  const { pathname } = useLocation();
  const [y, setY] = useState(window.scrollY);
  const [clickedSearch, setClickedSearch] = useState(false);
  const [isBackgroundVisible, setVisibleBackground] = useState(false);

  const isNotProfilePage = !pathname.includes('/user') && !pathname.includes('/artist');
  const isNotView = !pathname.includes('/view');

  const handleNavigation = useCallback(
    (event) => {
      const window = event.currentTarget;

      if (y < window.scrollY) {
        setVisibleBackground(true);
      }

      if (window.pageYOffset == 0) {
        setVisibleBackground(false);
      }
      setY(window.scrollY);
    },
    [y]
  );

  useEffect(() => {
    setY(window.scrollY);

    window.addEventListener('scroll', handleNavigation);

    return () => {
      window.removeEventListener('scroll', handleNavigation);
    };
  }, [handleNavigation]);

  return (
    <Box sx={{ position: 'sticky', top: 0 }} height={0} zIndex={1}>
      <Flex
        align="center"
        transition="all 200ms linear"
        bg={
          isBackgroundVisible || (pathname !== '/home' && isNotProfilePage && isNotView)
            ? theme.colors.primaryBase.value
            : GRADIENTS.top
        }
        borderBottom={isBackgroundVisible && `.5px solid ${theme.colors.primaryLine.value}`}
      >
        <ProfileIcon />

        <Spacer />

        {clickedSearch ? (
          <SearchBar setClickedSearch={setClickedSearch} />
        ) : (
          items.map((item, index) => (
            <Item
              key={index}
              text={item.text}
              icon={item.icon}
              to={item.to}
              onClick={
                item.text === 'Search' &&
                (() => {
                  setClickedSearch(true);
                })
              }
              isHighlighted={pathname === `/${item.text.toLowerCase()}`}
            />
          ))
        )}

        <Spacer />

        <Tooltip label="For help, issues, or suggestions contact us via: official.ongaku@gmail.com">
          <IconButton
            variant="link"
            color="whiteAlpha.800"
            margin="10px"
            height="100%"
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
  },
  {
    text: 'Rooms',
    icon: MdGroups,
    to: '/rooms',
  },
];

function Item({ text, icon, to, isHighlighted, onClick }) {
  return (
    <Button
      variant="link"
      fontSize="xl"
      as={to && RouterLink}
      to={to && to}
      onClick={onClick}
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
