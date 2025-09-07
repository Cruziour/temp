// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   },
// });

// // Interceptors
// // axiosInstance.interceptors.request.use()

// axiosInstance.interceptors.response.use((config) => {
//   // Do something before request is sent
//   return config;
// }, async (error) => {
//   // Do something with request error
//   const originalRequest = error.config;
//   if (error.response.status === 401 && error.config && !error.config._isRetry) {
//     originalRequest.isRetry = true
//     try {
//       await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/refresh-token`,
//         {
//           withCredentials: true,
//         }
//       );
//       return axiosInstance.request(originalRequest)
//     } catch (error) {
//       console.log(error.message);
//     }
//   }
//   throw error
// })

// export default axiosInstance;

import axios from 'axios';

let accessToken = null;
let refreshToken = null;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add Authorization header before every request if token exists
axiosInstance.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Handle expired token & refresh flow
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._isRetry &&
      refreshToken
    ) {
      originalRequest._isRetry = true;
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/refresh-token`,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        // Extract new tokens from response headers
        accessToken =
          data?.data?.accessToken ||
          error.response?.headers?.authorization?.replace('Bearer ', '');
        refreshToken =
          data?.data?.refreshToken ||
          error.response?.headers?.['x-refresh-token'];

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError.message);
      }
    }
    return Promise.reject(error);
  }
);

export const setTokens = (access, refresh) => {
  accessToken = access;
  refreshToken = refresh;
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
};

export default axiosInstance;
