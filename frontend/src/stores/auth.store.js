import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(
    token.value && localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null
  )

  const isAuthenticated = computed(() => !!token.value)
  const rolActual = computed(() => user.value?.rol || user.value?.role || null)

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })

    token.value = data.token
    user.value = data.user

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    token,
    user,
    isAuthenticated,
    rolActual,
    login,
    logout
  }
})
