import axios from 'axios';

import { useAuthStore } from '@/stores/useAuthStore';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

apiClient.interceptors.request.use((request) => {
  const csrf = useAuthStore.getState().csrfToken;

  if (!csrf && request.url !== 'csrf') {
    throw new axios.Cancel();
  }

  request.headers['X-CSRF-TOKEN'] = csrf;

  return request;
});

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let message = '';
    if (error.response) {
      message = error.response.data.message || error.message || error;
    } else {
      message = 'No pudimos procesar tu solicitud, inténtalo de nuevo más tarde';
    }

    return Promise.reject(message);
  }
);
