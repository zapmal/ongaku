import { apiClient } from '@/lib/api';

export const getHomeData = () => {
  return apiClient.get('home');
};
