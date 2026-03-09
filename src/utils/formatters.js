/**
 * Formatting utilities
 */

export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined) return 'N/A'
  return Number(num).toFixed(decimals)
}

export const formatPercentage = (num, decimals = 1) => {
  if (num === null || num === undefined) return 'N/A'
  return `${(Number(num) * 100).toFixed(decimals)}%`
}

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  } catch {
    return dateString
  }
}

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleString()
  } catch {
    return dateString
  }
}
