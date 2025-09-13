import axios, { type AxiosResponse, type AxiosError } from 'axios';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed in the future
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    console.error('Response error:', error);
    
    // Handle common HTTP errors
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login if needed
      console.error('Unauthorized access');
    } else if (error.response?.status === 403) {
      console.error('Forbidden access');
    } else if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error');
    }

    // Enhance error object with user-friendly message
    const enhancedError = {
      ...error,
      message: getErrorMessage(error),
    };

    return Promise.reject(enhancedError);
  }
);

// Helper function to extract user-friendly error messages
function getErrorMessage(error: AxiosError): string {
  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as any;
    if (data.message) return data.message;
    if (data.error) return data.error;
  }

  switch (error.response?.status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication required.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This action conflicts with existing data.';
    case 422:
      return 'The provided data is invalid.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Internal server error. Please try again.';
    case 502:
      return 'Service temporarily unavailable.';
    case 503:
      return 'Service temporarily unavailable.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
}