import { Box } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AudioPlayerProvider } from 'react-use-audio-player';

import { NavigationBar, Player } from '@/components/Core';
import { Spinner } from '@/components/Utils';
import { CurrentRoomOverlay, removeUser, deleteRoom } from '@/features/app';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRoomStore } from '@/stores/useRoomStore';

export function Layout() {
  const { pathname } = useLocation();
  const room = useRoomStore((s) => s.room);
  const entity = useAuthStore((s) => s.entity);

  const isNotProfilePage = !pathname.includes('/user') && !pathname.includes('/artist');
  const isNotView = !pathname.includes('/view');

  const hasTopMargin = !pathname.includes('/home') &&
    isNotProfilePage &&
    isNotView && { marginTop: '80px' };

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser);
    window.addEventListener('unload', handleTabClosing);
    return () => {
      window.removeEventListener('beforeunload', alertUser);
      window.removeEventListener('unload', handleTabClosing);
    };
  });

  const handleTabClosing = async () => {
    try {
      if (room.host === entity.id) {
        await deleteRoom(room.key);
      } else if (room.users.includes(entity.id)) {
        await removeUser({ userId: entity.id, key: room.key });
      }
    } catch (error) {
      console.log('Error intentando salir/eliminar la sala', error);
    }
  };

  const alertUser = (event) => {
    event.preventDefault();

    event.returnValue = '';
  };

  return (
    <React.Suspense fallback={<Spinner />}>
      <AudioPlayerProvider>
        <NavigationBar />
        <Box {...hasTopMargin}>
          <Outlet />
        </Box>
        {room.length !== 0 && !pathname.includes('/room') && (
          <CurrentRoomOverlay
            name={room.name}
            activeUsers={room.users.length}
            host={room.user.username}
            userLimit={room.limit}
            roomId={room.key}
          />
        )}
        <Player />
      </AudioPlayerProvider>
    </React.Suspense>
  );
}
