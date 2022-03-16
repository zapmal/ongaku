import { Box } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AudioPlayerProvider } from 'react-use-audio-player';

import { NavigationBar, Player } from '@/components/Core';
import { Spinner } from '@/components/Utils';
import { CurrentRoomOverlay, removeUser, deleteRoom } from '@/features/app';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useRoomStore } from '@/stores/useRoomStore';

export function Layout() {
  const { pathname } = useLocation();
  const room = useRoomStore((s) => s.room);
  const entity = useAuthStore((s) => s.entity);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const isNotProfilePage = !pathname.includes('/user') && !pathname.includes('/artist');
  const isNotView = !pathname.includes('/view');

  const hasTopMargin = !pathname.includes('/home') &&
    isNotProfilePage &&
    isNotView && { marginTop: '80px' };

  useEffect(() => {
    window.addEventListener('beforeunload', removeOrDeleteRoomBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', removeOrDeleteRoomBeforeUnload);
    };
  });

  const removeOrDeleteRoomBeforeUnload = async (event) => {
    event.preventDefault();

    try {
      if (room.length !== 0) {
        if (room.host === entity.id) {
          await deleteRoom(room.key);

          addNotification({
            title: 'Exito',
            status: 'info',
            message: 'Intento de cerrar la aplicación detectado, la sala actual fue eliminada',
          });
        } else if (room.users.includes(entity.id)) {
          await removeUser({ userId: entity.id, key: room.key });

          addNotification({
            title: 'Error',
            status: 'error',
            message:
              'Intento de cerrar la aplicación detectado, se intentó cerrar / salir de la sala sin exito, hagalo manualmente',
          });
        }
      }
    } catch (error) {
      console.log('Error intentando salir/eliminar la sala', error);
    }

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
