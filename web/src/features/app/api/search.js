import { apiClient } from '@/lib/api';

export const searchByQuery = (query) => {
  return apiClient.get(`search?query=${query}`);
};
