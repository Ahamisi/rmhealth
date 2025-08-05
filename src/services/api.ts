import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
const API_TIMEOUT = 30000

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token')
      window.location.href = '/outbound/auth'
    }
    
    return Promise.reject(error)
  }
)

// API Types
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface LoginRequest {
  phone: string
  password: string
  remember_me?: boolean
}

export interface LoginResponse {
  user: {
    id: number
    name: string
    phone: string
    role: string
  }
  token: string
  expires_at: string
}

export interface FulfillmentAgent {
  id: number
  name: string
  orders_count: number
  items_count: number
  check_in_time: string
  check_out_time: string
  productivity_score: number
}

// API Methods
class ApiService {
  // Authentication
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  }

  async logout(): Promise<ApiResponse> {
    const response = await apiClient.post('/auth/logout')
    return response.data
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await apiClient.post('/auth/refresh')
    return response.data
  }

  // Outbound Module
  async getDashboardStats(): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/outbound/dashboard/stats')
    return response.data
  }

  async getFulfillmentAgents(date?: string): Promise<ApiResponse<FulfillmentAgent[]>> {
    const params = date ? { date } : {}
    const response = await apiClient.get('/outbound/fulfillment/agents', { params })
    return response.data
  }

  async getOrderTimeTracker(year?: number): Promise<ApiResponse<any>> {
    const params = year ? { year } : {}
    const response = await apiClient.get('/outbound/orders/time-tracker', { params })
    return response.data
  }

  // Generic CRUD operations
  async get<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.get(endpoint, config)
    return response.data
  }

  async post<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.post(endpoint, data, config)
    return response.data
  }

  async put<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.put(endpoint, data, config)
    return response.data
  }

  async delete<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.delete(endpoint, config)
    return response.data
  }
}

// Export singleton instance
export const api = new ApiService()
export default api 

// Outbound module endpoints
export const outboundAPI = {
  // Order Time Tracker
  async getOrderTimeTracker(orderId?: string): Promise<TimelineStep[]> {
    const response = await apiClient.get(`/outbound/orders/${orderId || 'current'}/timeline`);
    return response.data.data;
  },
};

// Type definitions for API responses
interface TimelineStep {
  id: string;
  department: 'accounting' | 'inventory' | 'logistics';
  title: string;
  description: string;
  duration: string;
  icon: string;
  color: string;
  fromStatus: string;
  toStatus: string;
  timestamp?: string;
  completed?: boolean;
} 