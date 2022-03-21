import { apiClient } from '@/lib/api';

export const getFollowedArtists = () => {
  return apiClient.get('artist/followed');
};

export const getLatestArtists = () => {
  return apiClient.get('artist/latest');
};

export const followArtist = (data) => {
  return apiClient.put('artist/follow', data);
};
