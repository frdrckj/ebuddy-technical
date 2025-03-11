import axios, { AxiosRequestConfig } from 'axios';
import { auth } from './firebase';
import { User } from '@monorepo/shared';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/your-project-id/us-central1/api',
});

// Add token to requests
apiClient.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return config;
  }
});

// Define API functions
export const fetchUserData = async (): Promise<User> => {
  try {
    const response = await apiClient.get('/users/fetch-user-data');
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    throw error;
  }
};

export const updateUserData = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await apiClient.post('/users/update-user-data', userData);
    return response.data.data;
  } catch (error: any) {
    console.error('Error updating user data:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    throw error;
  }
};
