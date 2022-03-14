import { apiClient } from '@/lib/api';

export const getLikedSongs = () => {
  return apiClient.get('song/liked');
};
