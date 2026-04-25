import axios from 'axios';

const API_BASE_URL = 'http://localhost:5213/api';

// Token management
let accessToken = null;

// Export token setters/getters
export const setTokens = (access, refresh) => {
  accessToken = access;
  if (refresh) {
    localStorage.setItem('refreshToken', refresh);
  }
};

export const getAccessToken = () => accessToken;

export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const clearTokens = () => {
  accessToken = null;
  localStorage.removeItem('refreshToken');
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = getRefreshToken();

    // Handle 401 - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            RefreshToken: refreshToken,
          });

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
          setTokens(newAccessToken, newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed - clear tokens and let app handle logout
          clearTokens();
          window.dispatchEvent(new Event('auth:logout'));
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available - clear access token
        clearTokens();
        window.dispatchEvent(new Event('auth:logout'));
      }
    }

    // Handle 403 - retry without token for anonymous endpoints
    if (error.response?.status === 403 && !originalRequest._retryWithoutToken) {
      originalRequest._retryWithoutToken = true;
      delete originalRequest.headers.Authorization;
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
