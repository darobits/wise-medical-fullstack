<template>
  <div>
    <h2 class="auth-form-title">Iniciar sesión</h2>
    <p class="auth-form-subtitle">
      Accedé al panel de gestión de turnos médicos.
    </p>

    <form @submit.prevent="onSubmit">
      <div class="auth-field">
        <label for="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          v-model="email"
          placeholder="ejemplo@correo.com"
          required
        />
      </div>

      <div class="auth-field">
        <label for="password">Contraseña</label>
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="••••••••"
          required
        />
      </div>

      <p v-if="error" class="text-error">
        {{ error }}
      </p>

      <button
        class="auth-button"
        type="submit"
        :disabled="loading"
      >
        {{ loading ? 'Ingresando...' : 'Ingresar' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const onSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push({ name: 'dashboard-home' })
  } catch (err) {
    error.value = err?.response?.data?.message || 'Error al iniciar sesión.'
  } finally {
    loading.value = false
  }
}
</script>
