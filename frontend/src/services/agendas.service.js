import api from './api'

// GET /api/agendas con filtros opcionales
export const fetchAgendas = (filters = {}) => {
  return api.get('/agendas', { params: filters })
}
