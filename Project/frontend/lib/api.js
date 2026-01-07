/**
 * API Configuration
 * Centralized API base URL configuration
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  // Admin endpoints
  USERS: "/api/admin/users",
  WASTE_LOGS: "/api/admin/waste-logs",
  BINS: "/api/admin/bins",

  // Stats endpoint
  STATS: "/api/stats/stats",
}

/**
 * Helper function to build full API URL
 */
export const getApiUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint, API_BASE_URL)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value)
    }
  })
  return url.toString()
}
