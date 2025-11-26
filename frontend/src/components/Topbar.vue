<template>
  <header class="dashboard-topbar">
    <div class="topbar-left">
      <h2>{{ tituloActual }}</h2>
    </div>
    <div class="topbar-right">
      <div class="topbar-user">
        <span class="topbar-user-name">
          {{ nombreUsuario }}
        </span>
        <span class="topbar-user-role">
          {{ rolUsuario }}
        </span>
      </div>
      <button class="topbar-logout" @click="handleLogout">
        Cerrar sesión
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const tituloActual = computed(() => {
  switch (route.name) {
    case 'dashboard-home':
      return 'Inicio'
    case 'dashboard-turnos':
      return 'Turnos'
    case 'dashboard-agendas':
      return 'Agendas'
    case 'dashboard-usuarios':
      return 'Usuarios'
    case 'dashboard-perfil':
      return 'Mi perfil'
    default:
      return 'Panel WISE Medical'
  }
})

const nombreUsuario = computed(
  () => authStore.user?.nombre || authStore.user?.name || 'Usuario'
)

const rolUsuario = computed(() => authStore.rolActual || 'SIN ROL')

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>
