import { Box } from '@chakra-ui/react';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { CurrentRoomOverlay } from '../../../features/app/components/CurrentRoomOverlay';

import { NavigationBar, Player } from '@/components/Core';

export function Layout() {
  const { pathname } = useLocation();

  const isNotProfilePage = !pathname.includes('/user') && !pathname.includes('/artist');
  const hasTopMargin = !pathname.includes('/home') && isNotProfilePage && { marginTop: '80px' };

  return (
    <>
      <NavigationBar />
      <Box {...hasTopMargin}>
        <Outlet />
      </Box>
      {false && (
        <CurrentRoomOverlay
          name="Rolas Vergatarias"
          host="El Papi"
          activeUsers={5}
          userLimit={5}
          roomId="ADAD-139D"
        />
      )}
      <Player />
    </>
  );
}
