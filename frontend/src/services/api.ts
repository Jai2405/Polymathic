/**
 * API Configuration
 *
 * This file sets up axios for making HTTP requests to the backend.
 *
 * Axios is an HTTP client library that:
 * - Makes API calls easier
 * - Handles request/response transformation
 * - Provides interceptors for logging, auth, etc.
 */

import axios from "axios"

// Base URL for API requests
// In development, backend runs on localhost:8000
// In production, this would be your deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

/**
 * Axios instance configured for our API
 *
 * All API requests should use this instance.
 * It's pre-configured with:
 * - Base URL (http://localhost:8000)
 * - Default headers (Content-Type: application/json)
 * - Timeout (30 seconds)
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor (runs before every request)
// Useful for adding auth tokens, logging, etc.
api.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`→ ${config.method?.toUpperCase()} ${config.url}`)
    }

    // Add auth token here in future phases
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }

    return config
  },
  (error) => {
    console.error("Request error:", error)
    return Promise.reject(error)
  }
)

// Response interceptor (runs after every response)
// Useful for error handling, logging, etc.
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log(`← ${response.status} ${response.config.url}`)
    }
    return response
  },
  (error) => {
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error("Response error:", error.response?.data || error.message)
    }

    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const message = error.response.data?.detail || error.message

      switch (status) {
        case 400:
          console.error("Bad Request:", message)
          break
        case 401:
          console.error("Unauthorized:", message)
          // Redirect to login in future phases
          break
        case 404:
          console.error("Not Found:", message)
          break
        case 500:
          console.error("Server Error:", message)
          break
        default:
          console.error(`Error ${status}:`, message)
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response from server. Is the backend running?")
    } else {
      // Something else happened
      console.error("Request setup error:", error.message)
    }

    return Promise.reject(error)
  }
)
