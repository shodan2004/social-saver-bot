import { formatDistanceToNow } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return ''
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const truncate = (text, length = 150) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

export const getPlatformIcon = (platform) => {
  const icons = {
    instagram: '📸',
    twitter: '𝕏',
    blog: '📝',
    other: '🔗',
  }
  return icons[platform] || '🔗'
}

export const getCategoryColor = (category) => {
  const colors = {
    Fitness: 'bg-red-100 text-red-800',
    Coding: 'bg-blue-100 text-blue-800',
    Food: 'bg-orange-100 text-orange-800',
    Travel: 'bg-green-100 text-green-800',
    Design: 'bg-purple-100 text-purple-800',
    Business: 'bg-yellow-100 text-yellow-800',
    Education: 'bg-indigo-100 text-indigo-800',
    Entertainment: 'bg-pink-100 text-pink-800',
    Health: 'bg-emerald-100 text-emerald-800',
    Productivity: 'bg-cyan-100 text-cyan-800',
    Other: 'bg-gray-100 text-gray-800',
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

export const generateUserId = () => {
  return `user_${Math.random().toString(36).substr(2, 9)}`
}

export const getUserIdFromStorage = () => {
  const key = 'social_saver_user_id'
  let userId = localStorage.getItem(key)
  if (!userId) {
    userId = generateUserId()
    localStorage.setItem(key, userId)
  }
  return userId
}

export const setUserIdInStorage = (userId) => {
  localStorage.setItem('social_saver_user_id', userId)
}
