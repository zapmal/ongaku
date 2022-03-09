import { apiClient } from '@/lib/api';

export const updateAlbum = (data) => {
  return apiClient.put('album/edit', data);
};

export const createAlbum = (data) => {
  return apiClient.post('album/new', data);
};

export const getAllAlbums = () => {
  return apiClient.get('album/all');
};

export const deleteAlbum = (id) => {
  return apiClient.delete(`album/${id}`);
};

export const getAllSongs = () => {
  return apiClient.get('song/all');
};

export const updateSong = (data) => {
  return apiClient.put('song/edit', data);
};

export const createSong = (data) => {
  return apiClient.post('song/new', data);
};

export const deleteSong = (id) => {
  return apiClient.delete(`song/${id}`);
};
