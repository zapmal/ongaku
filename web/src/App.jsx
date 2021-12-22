import React, { useCallback, useEffect } from 'react';

import { apiClient } from '@/lib/api';
import { AppProvider } from '@/providers/app';
import { AppRoutes } from '@/routes';
import { useAuthStore } from '@/stores/useAuthStore';

function App() {
  const [csrfToken, setEntity, setCsrfToken] = useAuthStore((s) => [
    s.csrfToken,
    s.setEntity,
    s.setCsrfToken,
  ]);

  /**
   * Had to use "useCallback" here because two requests happen simultaneously, which
   * can lead to a race condition or to the "memory leak" warning.
   *
   * Problem with this auto-login is the indicator (loading), this will
   * probably need to be changed.
   */
  const handleNoCsrf = useCallback(async () => {
    if (!csrfToken) {
      try {
        const requestedCsrf = await apiClient.get('/csrf');
        setCsrfToken(requestedCsrf);

        const user = await apiClient.get('/whoami');
        setEntity(user);
      } catch (error) {
        console.log('An error occured in the CSRF request or in the Auto-Login request.', error);
      }
    }
  }, [csrfToken, setCsrfToken, setEntity]);

  useEffect(() => {
    handleNoCsrf();
  }, [handleNoCsrf]);

  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
