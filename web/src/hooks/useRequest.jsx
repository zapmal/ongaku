import { useState, useEffect } from 'react';

import { useNotificationStore } from '@/stores/useNotificationStore';

export const useRequest = (
  initialState = {
    status: '',
    isSubmitting: false,
  }
) => {
  const [request, _setRequestState] = useState(initialState);
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      if (request.status !== 'success') {
        _setRequestState((prev) => ({ ...prev, status: '' }));
      }
    }, 7000);

    return () => clearInterval(errorTimeout);
  }, [request.status]);

  const setRequestState = ({ title, message, status, isSubmitting }) => {
    _setRequestState({
      status,
      isSubmitting,
    });

    if (title) {
      addNotification({
        title,
        message,
        status,
      });
    }
  };

  return [request, setRequestState];
};
