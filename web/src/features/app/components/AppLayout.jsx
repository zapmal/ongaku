import { Box } from '@chakra-ui/react';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { CurrentRoomOverlay } from './CurrentRoomOverlay';

import { NavigationBar, Player } from '@/components/Core';

export function AppLayout() {
  const { pathname } = useLocation();

  const hasTopMargin = !pathname.includes('/home') && { marginTop: '80px' };

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
