import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';

export const registerUser = (data) => {
  const { csrf } = useAuthStore.getState().csrfToken;
  const config = {
    headers: {
      'X-CSRF-Token': csrf,
    },
  };

  delete data.passwordConfirmation;
  const user = {
    ...data,
    role: 'USER',
  };

  return apiClient.post('register/user', user, config);
};

export const artistRegister = (data) => {
  return apiClient.post('register/artist', data);
};
