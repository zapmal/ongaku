import React from 'react';
import { toast } from 'react-toastify';

import { Toast } from './styles';

import { useNotificationStore } from '@/hooks/useNotificationStore';

export function Notifications() {
  const { notifications, dismissNotification } = useNotificationStore();

  return (
    <>
      {notifications.map((notification) => {
        toast.dark(notification.message, {
          toastId: notification.id,
          onOpen: () => console.log('opened'),
          onClose: () => dismissNotification(notification.id),
        });
      })}
      <Toast />
    </>
  );
}
