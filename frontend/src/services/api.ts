import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  updatePassword: async (passwords: { currentPassword: string; newPassword: string }) => {
    const response = await api.put('/auth/password', passwords);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getEntrepreneurs: async (params?: any) => {
    const response = await api.get('/users/entrepreneurs', { params });
    return response.data;
  },
  getInvestors: async (params?: any) => {
    const response = await api.get('/users/investors', { params });
    return response.data;
  },
  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await api.get('/users/stats/dashboard');
    return response.data;
  },
};

// Profiles API
export const profilesAPI = {
  getMyProfile: async () => {
    const response = await api.get('/profiles/me');
    return response.data;
  },
  updateMyProfile: async (profileData: any) => {
    const response = await api.put('/profiles/me', profileData);
    return response.data;
  },
  getProfileById: async (id: string) => {
    const response = await api.get(`/profiles/${id}`);
    return response.data;
  },
  updateAvatar: async (formData: FormData) => {
    const response = await api.post('/profiles/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Requests API
export const requestsAPI = {
  sendRequest: async (requestData: { entrepreneurId: string; message: string }) => {
    const response = await api.post('/requests', requestData);
    return response.data;
  },
  getMyRequests: async () => {
    const response = await api.get('/requests');
    return response.data;
  },
  updateRequestStatus: async (requestId: string, status: string, responseMessage?: string) => {
    const response = await api.patch(`/requests/${requestId}`, { status, responseMessage });
    return response.data;
  },
  getRequestById: async (requestId: string) => {
    const response = await api.get(`/requests/${requestId}`);
    return response.data;
  },
  deleteRequest: async (requestId: string) => {
    const response = await api.delete(`/requests/${requestId}`);
    return response.data;
  },
};

// Chat API
export const chatAPI = {
  sendMessage: async (messageData: { receiverId: string; content: string }) => {
    const response = await api.post('/chat/messages', messageData);
    return response.data;
  },
  getMessages: async (userId: string) => {
    const response = await api.get(`/chat/messages/${userId}`);
    return response.data;
  },
  getConversations: async () => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },
  markAsRead: async (userId: string) => {
    const response = await api.patch(`/chat/messages/${userId}/read`);
    return response.data;
  },
  getUnreadCount: async () => {
    const response = await api.get('/chat/unread-count');
    return response.data;
  },
};

export default api; 