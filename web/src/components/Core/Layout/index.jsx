import { Box } from '@chakra-ui/react';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AudioPlayerProvider } from 'react-use-audio-player';

// import { CurrentRoomOverlay } from '../../../features/app/components/CurrentRoomOverlay';

import { NavigationBar, Player } from '@/components/Core';
import { Spinner } from '@/components/Utils';

export function Layout() {
  const { pathname } = useLocation();

  const isNotProfilePage = !pathname.includes('/user') && !pathname.includes('/artist');
  const isNotView = !pathname.includes('/view');

  const hasTopMargin = !pathname.includes('/home') &&
    isNotProfilePage &&
    isNotView && { marginTop: '80px' };

  return (
    <React.Suspense fallback={<Spinner />}>
      <AudioPlayerProvider>
        <NavigationBar />
        <Box {...hasTopMargin}>
          <Outlet />
        </Box>
        {/* {false && (
        <CurrentRoomOverlay
          name="Buen Reguetón"
          host="rick_y"
          activeUsers={5}
          userLimit={5}
          roomId="ADAD-139D"
        />
      )} */}
        <Player />
      </AudioPlayerProvider>
    </React.Suspense>
  );
}
