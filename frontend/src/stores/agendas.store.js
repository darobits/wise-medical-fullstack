import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchAgendas } from '@/services/agendas.service'

export const useAgendasStore = defineStore('agendas', () => {
  const agendas = ref([])
  const loading = ref(false)
  const error = ref(null)

  const totalAgendas = computed(() => agendas.value.length)
  const agendasActivas = computed(() =>
    agendas.value.filter(a => a.activa === true)
  )

  const cargarAgendas = async (filters = {}) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await fetchAgendas(filters)
      agendas.value = Array.isArray(data) ? data : []
    } catch (err) {
      error.value =
        err?.response?.data?.message ||
        'Ocurrió un error al cargar las agendas.'
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    agendas,
    loading,
    error,
    totalAgendas,
    agendasActivas,
    cargarAgendas,
    clearError
  }
})
