/**
 * API Configuration
 * Centralized API base URL configuration with automatic fallback
 */

// Primary and fallback URLs
const PRIMARY_API_URL = process.env.NEXT_PUBLIC_API_URL
const FALLBACK_API_URL = "http://localhost:5000"

// Current active API base URL (can change during runtime)
let currentApiBaseUrl = PRIMARY_API_URL || FALLBACK_API_URL

export const API_BASE_URL = currentApiBaseUrl

/**
 * Smart fetch with automatic fallback
 * Tries primary URL first, falls back to localhost if it fails
 */
export const apiFetch = async (endpoint, options = {}) => {
  const urls = PRIMARY_API_URL ? [PRIMARY_API_URL, FALLBACK_API_URL] : [FALLBACK_API_URL]
  
  for (let i = 0; i < urls.length; i++) {
    const baseUrl = urls[i]
    const fullUrl = `${baseUrl}${endpoint}`
    
    try {
      console.log(`🔄 Trying API: ${fullUrl}`)
      
      // Create timeout controller
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(fullUrl, {
        ...options,
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok || response.status < 500) {
        // Update current base URL if successful
        currentApiBaseUrl = baseUrl
        console.log(`✅ API connected: ${baseUrl}`)
        return response
      }
    } catch (error) {
      console.warn(`⚠️ API failed (${baseUrl}):`, error.message)
      
      // If this is the last URL, throw the error
      if (i === urls.length - 1) {
        throw error
      }
      // Otherwise, continue to next URL
    }
  }
}

/**
 * Get current active API base URL
 */
export const getActiveApiUrl = () => currentApiBaseUrl

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
  const url = new URL(endpoint, currentApiBaseUrl)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value)
    }
  })
  return url.toString()
}
