import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

import AuthLayout from '../layouts/AuthLayout.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'

import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'

import HomeView from '../views/dashboard/HomeView.vue'
import TurnosView from '../views/dashboard/TurnosView.vue'
import AgendasView from '../views/dashboard/AgendasView.vue'
import UsuariosView from '../views/dashboard/UsuariosView.vue'
import PerfilView from '../views/dashboard/PerfilView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: '/login',
        name: 'login',
        component: LoginView
      },
      {
        path: '/register',
        name: 'register',
        component: RegisterView,
        meta: { requiresAuth: true, roles: ['ADMIN'] }
      }
    ]
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard-home',
        component: HomeView
      },
      {
        path: 'turnos',
        name: 'dashboard-turnos',
        component: TurnosView
      },
      {
        path: 'agendas',
        name: 'dashboard-agendas',
        component: AgendasView
      },{
  path: 'agendas/:id',
  name: 'agenda-edit',
  component: () => import('@/views/dashboard/AgendaEditView.vue'),
  meta: {
    requiresAuth: true,
    roles: ['ADMIN']
  }
},      {
        path: 'usuarios',
        name: 'dashboard-usuarios',
        component: UsuariosView,
        meta: { roles: ['ADMIN'] }
      },
      {
        path: 'perfil',
        name: 'dashboard-perfil',
        component: PerfilView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  const allowedRoles = to.meta.roles

  if (!requiresAuth && authStore.isAuthenticated && to.name === 'login') {
    return next({ name: 'dashboard-home' })
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login' })
  }

  if (requiresAuth && allowedRoles && !allowedRoles.includes(authStore.rolActual)) {
    return next({ name: 'dashboard-home' })
  }

  next()
})

export default router
