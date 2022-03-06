import { apiClient } from '@/lib/api';

export const updateProfileData = (data) => {
  return apiClient.put('artist/edit', data);
};

export const getProfileData = (data) => {
  return apiClient.get(`artist/profile/${data}`);
};
