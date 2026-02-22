import axios from 'axios'

// In local dev, use Vite proxy (/api -> backend) to avoid CORS issues.
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const contentAPI = {
  // Get all user IDs with saved content
  getUsers: () => api.get('/api/content/users'),

  // Get all content for a user
  getUserContent: (userId, skip = 0, limit = 20) =>
    api.get(`/api/content/${userId}/all`, { params: { skip, limit } }),

  // Search content
  searchContent: (userId, query, category = null, platform = null) =>
    api.get(`/api/content/${userId}/search`, {
      params: { q: query, category, platform },
    }),

  // Get single content
  getContent: (userId, contentId) =>
    api.get(`/api/content/${userId}/${contentId}`),

  // Create content
  createContent: (data) => api.post('/api/content/', data),

  // Update content
  updateContent: (userId, contentId, data) =>
    api.put(`/api/content/${userId}/${contentId}`, data),

  // Delete/Archive content
  deleteContent: (userId, contentId) =>
    api.delete(`/api/content/${userId}/${contentId}`),

  // Get categories
  getCategories: (userId) =>
    api.get(`/api/content/${userId}/filters/categories`),

  // Get platforms
  getPlatforms: (userId) =>
    api.get(`/api/content/${userId}/filters/platforms`),
}

export const healthAPI = {
  // Health check
  check: () => api.get('/api/health'),
}

export default api
