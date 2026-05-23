import axios from 'axios'
import { authStorage } from '../utils/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
client.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
client.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        authStorage.clearToken()
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred'
      return Promise.reject(new Error(message))
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('No response from server'))
    } else {
      // Error setting up request
      return Promise.reject(error)
    }
  }
)

export default client
