import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';

const abortController = new AbortController();

const prepareRequest = (data) => {
  const csrf = useAuthStore.getState().csrfToken;

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
  const [user, config] = prepareRequest(data);

  if (config.signal) abortController.abort();

  return apiClient.post('register/user', user, config);
};

export const registerArtist = (data) => {
  const [artist, config] = prepareRequest(data);

  if (config.signal) abortController.abort();

  return apiClient.post('register/artist', artist, config);
};

export const login = (data) => {
  const [entity, config] = prepareRequest(data);

  if (config.signal) abortController.abort();

  return apiClient.post('login', entity, config);
};
