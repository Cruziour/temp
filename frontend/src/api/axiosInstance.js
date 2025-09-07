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

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Helper: Get tokens from localStorage
const getTokens = () => {
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
};

// Helper: Save tokens to localStorage
export const saveTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};

// Helper: Clear tokens (logout)
export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Request Interceptor → Add Authorization Header
axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = getTokens();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response Interceptor → Handle 401 & Refresh Token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;
      const { refreshToken } = getTokens();

      if (!refreshToken) {
        return Promise.reject(error); // No refresh token → logout
      }

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/refresh-token`,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const newAccessToken =
          data?.data?.accessToken ||
          data?.accessToken ||
          data?.token;
        const newRefreshToken =
          data?.data?.refreshToken ||
          data?.refreshToken;

        // Save new tokens to localStorage
        saveTokens(newAccessToken, newRefreshToken);

        // Retry original request with new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError.message);
        clearTokens(); // Force logout
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

