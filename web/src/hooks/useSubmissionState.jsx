import { useState, useEffect } from 'react';

import { useNotificationStore } from '@/stores/useNotificationStore';

export const useSubmissionState = (
  initialState = {
    status: '',
    isSubmitting: false,
  }
) => {
  const [submission, _setSubmissionState] = useState(initialState);
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      if (submission.status !== 'success') {
        _setSubmissionState((prev) => ({ ...prev, status: '' }));
      }
    }, 7000);

    return () => clearInterval(errorTimeout);
  }, [submission.status]);

  const setSubmissionState = ({ title, message, status, isSubmitting }) => {
    _setSubmissionState({
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

  return [submission, setSubmissionState];
};
