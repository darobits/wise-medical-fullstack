<template>
  <nav class="sidebar">
    <div class="sidebar-header">
      <LogoWiseMedical />
    </div>

    <ul class="sidebar-nav">
      <li>
        <RouterLink
          :to="{ name: 'dashboard-home' }"
          class="sidebar-link"
          :class="{ 'is-active': route.name === 'dashboard-home' }"
        >
          <span>Inicio</span>
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'dashboard-turnos' }"
          class="sidebar-link"
          :class="{ 'is-active': route.name === 'dashboard-turnos' }"
        >
          <span>Turnos</span>
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'dashboard-agendas' }"
          class="sidebar-link"
          :class="{ 'is-active': route.name === 'dashboard-agendas' }"
        >
          <span>Agendas</span>
        </RouterLink>
      </li>
      <li v-if="esAdmin">
        <RouterLink
          :to="{ name: 'dashboard-usuarios' }"
          class="sidebar-link"
          :class="{ 'is-active': route.name === 'dashboard-usuarios' }"
        >
          <span>Usuarios</span>
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'dashboard-perfil' }"
          class="sidebar-link"
          :class="{ 'is-active': route.name === 'dashboard-perfil' }"
        >
          <span>Mi perfil</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import LogoWiseMedical from './LogoWiseMedical.vue'

const route = useRoute()
const authStore = useAuthStore()

const esAdmin = computed(() => authStore.rolActual === 'ADMIN')
</script>
