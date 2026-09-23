import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err?.response?.data?.detail ||
      err?.message ||
      'An unexpected error occurred'

    return Promise.reject(
      new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
    )
  }
)

// Prediction APIs
export const predictSingle = (payload) => api.post('/predict', payload)
export const predictAll = (payload) => api.post('/predict/all', payload)

// Model info APIs
export const getModels = () => api.get('/models')
export const getModelInfo = (key) => api.get(`/models/${key}`)
export const getDatasetStats = () => api.get('/models/dataset-stats')

// History APIs
export const getHistory = (skip = 0, limit = 50) =>
  api.get('/history', { params: { skip, limit } })

export const getHistoryCount = () => api.get('/history/count')
export const deleteHistory = (id) => api.delete(`/history/${id}`)
export const clearHistory = () => api.delete('/history')

export default api