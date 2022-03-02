import { apiClient } from '@/lib/api';

export const getLikedAlbums = () => {
  return apiClient.get('album/liked');
};

export const likeAlbum = (data) => {
  return apiClient.put('album/like', data);
};
