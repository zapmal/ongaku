import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';

const abortController = new AbortController();

const prepareAuthRequest = (data, isRegistration = true) => {
  const csrf = useAuthStore.getState().csrfToken;

  const config = {
    headers: {
      'X-CSRF-Token': csrf,
    },
  };

  const entity = { ...data };
  delete entity.passwordConfirmation;

  if (isRegistration) {
    if (data.username) {
      entity.role = 'USER';
    } else {
      entity.role = 'ARTIST';
    }
  }

  if (!csrf) {
    return [entity, { signal: abortController.signal }];
  }

  return [entity, config];
};

export const registerUser = (data) => {
  const [user, config] = prepareAuthRequest(data);

  if (config.signal) abortController.abort();

  return apiClient.post('register/user', user, config);
};

export const registerArtist = (data) => {
  const [artist, config] = prepareAuthRequest(data);

  if (config.signal) abortController.abort();

  return apiClient.post('register/artist', artist, config);
};

export const login = (data) => {
  const [entity, config] = prepareAuthRequest(data, false);

  if (config.signal) abortController.abort();

  return apiClient.post('login', entity, config);
};

export const markAsVerified = (data) => {
  const csrf = useAuthStore.getState().csrfToken;

  if (!csrf) abortController.abort();

  let config = {
    headers: {
      'X-CSRF-Token': csrf,
    },
  };

  return apiClient.post('verify', data, config);
};

export const resendVerificationEmail = (data) => {
  const csrf = useAuthStore.getState().csrfToken;

  if (!csrf) abortController.abort();

  let config = {
    headers: {
      'X-CSRF-Token': csrf,
    },
  };

  return apiClient.post('resend-verification', data, config);
};
