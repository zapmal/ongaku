import { apiClient } from '@/lib/api';

export const getLikedPlaylists = () => {
  return apiClient.get('playlist/liked');
};

export const createPlaylist = (data) => {
  return apiClient.post('playlist/new', data);
};

export const likePlaylist = (data) => {
  return apiClient.put('playlist/like', data);
};
