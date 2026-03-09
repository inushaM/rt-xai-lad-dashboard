import client from './client'

export const dashboardApi = {
  // Health check
  healthCheck: () => client.get('/api/health'),

  // Dashboard summary
  getSummary: () => client.get('/api/dashboard/summary'),

  // Metrics
  getMetrics: () => client.get('/api/metrics'),

  // Students
  getStudents: (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.code_module) params.append('code_module', filters.code_module)
    if (filters.code_presentation) params.append('code_presentation', filters.code_presentation)
    if (filters.risk_level) params.append('risk_level', filters.risk_level)
    return client.get(`/api/students?${params.toString()}`)
  },

  getStudent: (studentId) => client.get(`/api/students/${studentId}`),

  getHighRiskStudents: (limit = 20) => client.get(`/api/students/high-risk?limit=${limit}`),

  // Predictions
  predict: (payload) => client.post('/api/predict', payload),

  predictAll: () => client.get('/api/predict/all'),

  // Explanations
  getShapGlobal: () => client.get('/api/explanations/shap-global'),

  getShapLocal: (rowIndex) => client.get(`/api/explanations/shap-local/${rowIndex}`),

  getLimeExplanation: (payload) => client.post('/api/explanations/lime', payload),

  getLimeExplanationByRow: (rowIndex) => client.get(`/api/explanations/lime/${rowIndex}`),
}
