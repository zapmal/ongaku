import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';

const abortController = new AbortController();

const prepareRegistrationRequest = (data) => {
  const { csrf } = useAuthStore.getState().csrfToken;

  const config = {
    headers: {
      'X-CSRF-Token': csrf,
    },
  };

  const entity = { ...data };
  delete entity.passwordConfirmation;

  if (data.username) entity.role = 'USER';

  if (!csrf) {
    return [entity, { signal: abortController.signal }];
  }

  return [entity, config];
};

export const registerUser = (data) => {
  const [user, config] = prepareRegistrationRequest(data);

  if (config.signal) abortController.abort();

  return apiClient.post('register/user', user, config);
};

export const artistRegister = (data) => {
  const [artist, config] = prepareRegistrationRequest(data);

  if (config.signal) abortController.abort();

  return apiClient.post('register/artist', artist, config);
};
