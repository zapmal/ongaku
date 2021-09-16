import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

import { useNotificationStore } from '@/stores/useNotificationStore';

export function Notifications() {
  const toast = useToast();
  const { notifications, dismissNotification } = useNotificationStore();

  useEffect(() => {
    notifications.map((notification) => {
      if (!toast.isActive(notification.id)) {
        toast({
          id: notification.id,
          title: notification.title,
          description: notification.message,
          duration: 7000,
          isClosable: true,
          status: notification.status,
          onCloseComplete: () => dismissNotification(notification.id),
        });
      }
    });
  }, [dismissNotification, notifications, toast]);

  return null;
}
