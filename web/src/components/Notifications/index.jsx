import React from 'react';
import { toast } from 'react-toastify';

import { Toast } from './styles';

import { useNotificationStore } from '@/stores/useNotificationStore';

export function Notifications() {
  const { notifications, dismissNotification } = useNotificationStore();

  return (
    <>
      {notifications.map((notification) => {
        toast.dark(notification.message, {
          toastId: notification.id,
          onClose: () => dismissNotification(notification.id),
        });
      })}
      <Toast />
    </>
  );
}
