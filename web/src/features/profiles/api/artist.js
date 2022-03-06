import { apiClient } from '@/lib/api';

export const getProfileData = (data) => {
  return apiClient.get(`artist/profile/${data}`);
};
