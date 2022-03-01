import { apiClient } from '@/lib/api';

export const getFollowedArtists = () => {
  return apiClient.get('artist/followed');
};

export const followArtist = (data) => {
  return apiClient.put('artist/follow', data);
};
