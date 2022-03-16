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
import { useAuthStore } from '@/stores/useAuthStore';

export function NavigationBar() {
  const { pathname } = useLocation();
  const [y, setY] = useState(window.scrollY);
  const [clickedSearch, setClickedSearch] = useState(false);
  const [isBackgroundVisible, setVisibleBackground] = useState(false);
  const entity = useAuthStore((s) => s.entity);

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
          items.map((item, index) => {
            if (entity.role === 'ARTIST' && (item.to === '/library' || item.to === '/rooms')) {
              return null;
            }

            return (
              <Item
                key={index}
                text={item.text}
                icon={item.icon}
                to={item.to}
                onClick={
                  item.text === 'Búsqueda' &&
                  (() => {
                    setClickedSearch(true);
                  })
                }
                isHighlighted={pathname === item.to}
              />
            );
          })
        )}

        <Spacer />

        <Tooltip label="Si necesitas ayuda con un problema o deseas plantear una sugerencia, contáctanos: official.ongaku@gmail.com">
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
    text: 'Inicio',
    icon: MdHome,
    to: '/home',
  },
  {
    text: 'Librería',
    icon: MdLibraryMusic,
    to: '/library',
  },
  {
    text: 'Explora',
    icon: MdOutlineExplore,
    to: '/explore',
  },
  {
    text: 'Búsqueda',
    icon: MdSearch,
  },
  {
    text: 'Salas',
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
      marginLeft={text !== 'Inicio' && '20px'}
      marginRight={text !== 'Salas' && '20px'}
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
