import { useState, useEffect } from 'react';

export const useSubmissionState = (
  initialState = {
    status: '',
    isSubmitting: false,
  }
) => {
  const [submission, setSubmissionState] = useState(initialState);

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      if (submission.status !== 'success') {
        setSubmissionState((prev) => ({ ...prev, status: '' }));
      }
    }, 7000);

    return () => clearInterval(errorTimeout);
  }, [submission.status]);

  return [submission, setSubmissionState];
};
