import { apiClient } from '@/lib/api';

export const getProfileData = (data) => {
  return apiClient.get(`user/profile/${data}`);
};
