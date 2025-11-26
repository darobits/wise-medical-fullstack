<template>
  <div>
    <h2 class="auth-form-title">Registrar usuario</h2>
    <p class="auth-form-subtitle">
      Creá nuevos usuarios para el sistema WISE Medical.
    </p>

    <form @submit.prevent="onSubmit">
      <div class="auth-field">
        <label for="nombre">Nombre</label>
        <input
          id="nombre"
          type="text"
          v-model="nombre"
          placeholder="Nombre y apellido"
          required
        />
      </div>

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

      <div class="auth-field">
        <label for="rol">Rol</label>
        <select id="rol" v-model="rol" class="auth-select">
          <option value="USER">Usuario</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>

      <p v-if="error" class="text-error">
        {{ error }}
      </p>
      <p v-if="mensajeOk" class="text-success">
        {{ mensajeOk }}
      </p>

      <button
        class="auth-button"
        type="submit"
        :disabled="loading"
      >
        {{ loading ? 'Creando usuario...' : 'Crear usuario' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'

const nombre = ref('')
const email = ref('')
const password = ref('')
const rol = ref('USER')

const loading = ref(false)
const error = ref('')
const mensajeOk = ref('')

const resetForm = () => {
  nombre.value = ''
  email.value = ''
  password.value = ''
  rol.value = 'USER'
}

const onSubmit = async () => {
  error.value = ''
  mensajeOk.value = ''
  loading.value = true

  try {
    // Suponemos que el backend expone POST /api/users para crear usuarios
    await api.post('/users', {
      nombre: nombre.value,
      email: email.value,
      password: password.value,
      rol: rol.value
    })

    mensajeOk.value = 'Usuario creado correctamente.'
    resetForm()
  } catch (err) {
    error.value =
      err?.response?.data?.message ||
      'Ocurrió un error al crear el usuario.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.text-success {
  color: #4ade80;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.auth-select {
  background: rgba(15, 23, 42, 0.9);
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  padding: 0.7rem 1rem;
  color: var(--wm-text-light);
  outline: none;
  appearance: none;
}

.auth-select:focus {
  border-color: var(--wm-green);
  box-shadow: 0 0 0 1px rgba(0, 196, 106, 0.4);
}
</style>
