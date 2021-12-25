import axios from 'axios';

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
    let message = '';
    if (error.response) {
      message = error.response.data.message || error.message || error;
    } else {
      message = 'Unknown error, please try again later.';
    }

    return Promise.reject(message);
  }
);
