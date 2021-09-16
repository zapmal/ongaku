import axios from 'axios';

import { useNotificationStore } from '@/stores/useNotificationStore';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
});

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response.data.message || error.message;

    useNotificationStore.getState().addNotification({
      title: 'Network Error',
      message,
      status: 'error',
    });
    return Promise.reject(error);
  }
);
