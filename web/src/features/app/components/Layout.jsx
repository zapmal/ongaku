import { Box } from '@chakra-ui/react';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { NavigationBar } from './NavBar';
import { Player } from './Player';

export function AppLayout() {
  const { pathname } = useLocation();

  const hasTopMargin = !pathname.includes('/home') && { marginTop: '80px' };

  return (
    <>
      <NavigationBar />
      <Box {...hasTopMargin}>
        <Outlet />
      </Box>
      <Player />
    </>
  );
}
