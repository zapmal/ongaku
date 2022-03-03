import { apiClient } from '@/lib/api';

export const getLikedAlbums = () => {
  return apiClient.get('album/liked');
};

export const isAlbumLiked = (data) => {
  return apiClient.get(`album/liked/${data.albumId}`);
};

export const likeAlbum = (data) => {
  return apiClient.put('album/like', data);
};
