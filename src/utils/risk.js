/**
 * Risk level utilities
 */

export const getRiskLevel = (probability) => {
  if (probability < 0.4) return 'low'
  if (probability < 0.7) return 'medium'
  return 'high'
}

export const getRiskColor = (riskLevel) => {
  switch (riskLevel) {
    case 'low':
      return 'success'
    case 'medium':
      return 'warning'
    case 'high':
      return 'error'
    default:
      return 'default'
  }
}

export const getRiskLabel = (riskLevel) => {
  switch (riskLevel) {
    case 'low':
      return 'Low Risk'
    case 'medium':
      return 'Medium Risk'
    case 'high':
      return 'High Risk'
    default:
      return 'Unknown'
  }
}

export const formatRiskProbability = (probability) => {
  return `${(probability * 100).toFixed(1)}%`
}
