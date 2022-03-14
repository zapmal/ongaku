import { apiClient } from '@/lib/api';

export const getAllRooms = () => {
  return apiClient.get('rooms/all');
};

export const createNewRoom = (data) => {
  return apiClient.post('rooms/new', data);
};
