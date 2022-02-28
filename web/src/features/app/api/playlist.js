import { apiClient } from '@/lib/api';

export const getMyPlaylists = () => {
  return apiClient.get('playlist/all');
};

export const createPlaylist = (data) => {
  return apiClient.post('playlist/new', data);
};
