import { API_URL, API_BASE_URL } from 'react-native-dotenv';

// API Configuration
export const API_CONFIG = {
  BASE_URL: API_URL || 'http://192.168.0.10:3001',
  API_BASE_URL: API_BASE_URL || 'http://192.168.0.10:3001/api',

  // Timeouts
  TIMEOUT: 10000, // 10 seconds

  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,

  // Endpoints
  ENDPOINTS: {
    HEALTH: '/health',
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
      REFRESH: '/auth/refresh',
    },
    SUBJECTS: '/subjects',
    STUDY_CYCLES: '/study-cycles',
    COURSES: '/courses',
    SYNC: '/sync',
    USERS: '/users',
  },
};

// Helper function to build full URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.API_BASE_URL}${endpoint}`;
};

// Environment detection helpers
export const getEnvironmentInfo = () => {
  return {
    isDevelopment: __DEV__,
    apiUrl: API_CONFIG.BASE_URL,
    apiBaseUrl: API_CONFIG.API_BASE_URL,
  };
};

// Network configuration for different platforms
export const getNetworkConfig = () => {
  const { Platform } = require('react-native');

  if (Platform.OS === 'android') {
    // For Android emulator, use 10.0.2.2
    return {
      ...API_CONFIG,
      BASE_URL: API_URL?.replace('192.168.0.10', '10.0.2.2') || 'http://10.0.2.2:3001',
      API_BASE_URL: API_BASE_URL?.replace('192.168.0.10', '10.0.2.2') || 'http://10.0.2.2:3001/api',
    };
  }

  return API_CONFIG;
};

export default API_CONFIG;
