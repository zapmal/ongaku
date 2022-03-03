import { apiClient } from '@/lib/api';

export const updateProfileData = (data) => {
  return apiClient.put('user/profile', data);
};

export const getProfileData = (data) => {
  return apiClient.get(`user/profile/${data}`);
};
