import axios from 'axios';

// import { useNotificationStore } from '@/stores/useNotificationStore';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

// If more data from the request is needed, change
// apiClient -> axios and retrieve what's needed.
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // const message = error.response.data.message || error.message;

    // useNotificationStore.getState().addNotification({
    //   title: 'Error',
    //   message,
    //   status: 'error',
    // });
    return Promise.reject(error);
  }
);
