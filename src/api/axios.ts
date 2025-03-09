import axios from 'axios';
import * as authHelper from '../auth/_helpers';

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

instance.interceptors.request.use(
  (config) => {
    const token = authHelper.getAuth()?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success === false) {
      return Promise.reject({
        message: response.data.message,
        response: response.data
      });
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export { instance as axios };
