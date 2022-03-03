import { apiClient } from '@/lib/api';

export const updateProfileData = (data) => {
  return apiClient.put('user/edit', data);
};

export const getProfileData = (data) => {
  return apiClient.get(`user/profile/${data}`);
};
