import { apiClient } from '@/lib/api';

export const getAllRooms = () => {
  return apiClient.get('rooms/all');
};

export const createNewRoom = (data) => {
  return apiClient.post('rooms/new', data);
};

export const getRoom = (key) => {
  return apiClient.get(`rooms/${key}`);
};

export const deleteRoom = (key) => {
  return apiClient.delete(`rooms/${key}`);
};

export const addUser = (data) => {
  return apiClient.put(`rooms/${data.key}/add`, { userId: data.userId });
};

export const removeUser = (data) => {
  return apiClient.put(`rooms/${data.key}/remove`, { userId: data.userId });
};

export const banUser = (data) => {
  return apiClient.put(`rooms/${data.key}/ban`, { userId: data.userId });
};

export const updateQueue = (data) => {
  return apiClient.put(`rooms/${data.key}/update-queue`, { queue: data.queue });
};
