import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptors
// axiosInstance.interceptors.request.use()

axiosInstance.interceptors.response.use((config) => {
  // Do something before request is sent
  return config;
}, async (error) => {
  // Do something with request error
  const originalRequest = error.config;
  if (error.response.status === 401 && error.config && !error.config._isRetry) {
    originalRequest.isRetry = true
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/refresh-token`,
        {
          withCredentials: true,
        }
      );
      return axiosInstance.request(originalRequest)
    } catch (error) {
      console.log(error.message);
    }
  }
  throw error
})

export default axiosInstance;
