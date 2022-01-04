import { apiClient } from '@/lib/api';

export const registerUser = (data) => {
  delete data.passwordConfirmation;
  const user = { ...data, role: 'USER' };

  return apiClient.post('register/user', user);
};

export const registerArtist = (data) => {
  delete data.passwordConfirmation;
  const artist = { ...data, role: 'ARTIST' };

  return apiClient.post('register/artist', artist);
};

export const login = (data) => {
  const entity = {
    ...data,
  };

  return apiClient.post('login', entity);
};
