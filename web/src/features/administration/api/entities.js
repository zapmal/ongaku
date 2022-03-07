import { apiClient } from '@/lib/api';

export const getAllUsers = () => {
  return apiClient.get('user/all');
};

export const getAllArtists = () => {
  return apiClient.get('artist/all');
};

export const editUser = (data) => {
  return apiClient.put('user/edit', data);
};

export const editArtist = (data) => {
  return apiClient.put('artist/edit', data);
};
