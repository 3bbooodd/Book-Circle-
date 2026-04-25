import apiClient from './apiClient';
import { setTokens, clearTokens } from './apiClient';

// Register new user
export const register = async (userData) => {
  const mappedData = {
    FullName: userData.fullName,
    Email: userData.email,
    UserName: userData.userName,
    Password: userData.password,
    ConfirmPassword: userData.confirmPassword,
    Role: userData.role,
  };
  const response = await apiClient.post('/auth/register', mappedData);
  const { accessToken, refreshToken, user } = response.data;
  setTokens(accessToken, refreshToken);
  // Convert Roles array to single role string and add status
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    userName: user.userName,
    role: user.roles?.[0] || 'Reader',
    status: user.approvalStatus === 0 ? 'Pending' : 'Active',
    accessToken,
    refreshToken
  };
};

// Login user
export const login = async (credentials) => {
  const mappedData = {
    EmailOrUserName: credentials.emailOrUserName || credentials.email || credentials.userName,
    Password: credentials.password,
  };
  const response = await apiClient.post('/auth/login', mappedData);
  const { accessToken, refreshToken, user } = response.data;
  setTokens(accessToken, refreshToken);
  // Convert Roles array to single role string and add status
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    userName: user.userName,
    role: user.roles?.[0] || 'Reader',
    status: user.approvalStatus === 0 ? 'Pending' : 'Active',
    accessToken,
    refreshToken
  };
};

// Refresh token
export const refreshToken = async (refreshTokenValue) => {
  const mappedData = {
    RefreshToken: refreshTokenValue,
  };
  const response = await apiClient.post('/auth/refresh-token', mappedData);
  const { accessToken, refreshToken: newRefreshToken } = response.data;
  setTokens(accessToken, newRefreshToken);
  return { accessToken, refreshToken: newRefreshToken };
};

// Logout
export const logout = async (refreshTokenValue) => {
  try {
    const mappedData = {
      RefreshToken: refreshTokenValue,
    };
    await apiClient.post('/auth/logout', mappedData);
  } finally {
    clearTokens();
  }
};
