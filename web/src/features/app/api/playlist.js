import { apiClient } from '@/lib/api';

export const getLikedPlaylists = () => {
  return apiClient.get('playlist/liked');
};

export const isPlaylistLiked = (data) => {
  return apiClient.get(`playlist/liked/${data.playlistId}`);
};

export const createPlaylist = (data) => {
  return apiClient.post('playlist/new', data);
};

export const likePlaylist = (data) => {
  return apiClient.put('playlist/like', data);
};

export const addAlbumToPlaylist = (data) => {
  return apiClient.post('playlist/add-album', data);
};

export const addSongToPlaylist = (data) => {
  return apiClient.post('playlist/add-song', data);
};

export const removeFromPlaylist = (data) => {
  return apiClient.put('playlist/remove-song', data);
};

export const getPlaylist = (id) => {
  return apiClient.get(`playlist/${id}`);
};

export const deletePlaylist = (id) => {
  return apiClient.delete(`playlist/${id}`);
};

export const getLikedSongs = () => {
  return apiClient.get('song/liked');
};

export const likeSong = (data) => {
  return apiClient.put('song/like', data);
};
