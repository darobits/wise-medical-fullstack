<template>
  <div class="agendas-page">
    <header class="agendas-header">
      <h1>Gestión de agendas</h1>
      <p>
        Visualizá las agendas configuradas en el sistema junto con el profesional,
        la especialidad y los horarios de atención.
      </p>
    </header>

    <!-- Filtros -->
    <section class="agendas-filtros">
      <div class="filtros-grid">
        <!-- Búsqueda por texto (agenda / prestación / especialidad) -->
        <div class="auth-field">
          <label>Buscar</label>
          <input
            v-model="filtroTexto"
            placeholder="Ej: Clínica tarde, cardiología, consulta..."
          />
        </div>

        <!-- Filtro por especialidad -->
        <div class="auth-field">
          <label>Especialidad</label>
          <select
            v-model="filtroEspecialidadId"
            class="auth-select"
          >
            <option value="TODAS">Todas</option>
            <option
              v-for="esp in especialidadesDerivadas"
              :key="esp.id"
              :value="esp.id"
            >
              {{ esp.nombre }}
            </option>
          </select>
        </div>

        <!-- Estado -->
        <div class="auth-field">
          <label>Estado</label>
          <div class="estado-toggle">
            <button
              type="button"
              class="estado-pill"
              :class="{ 'estado-pill--active': filtroEstado === 'TODAS' }"
              @click="filtroEstado = 'TODAS'"
            >
              Todas
            </button>
            <button
              type="button"
              class="estado-pill"
              :class="{ 'estado-pill--active': filtroEstado === 'ACTIVAS' }"
              @click="filtroEstado = 'ACTIVAS'"
            >
              Activas
            </button>
            <button
              type="button"
              class="estado-pill"
              :class="{ 'estado-pill--active': filtroEstado === 'INACTIVAS' }"
              @click="filtroEstado = 'INACTIVAS'"
            >
              Inactivas
            </button>
          </div>
        </div>
      </div>
    </section>

    <LoadingSpinner v-if="loading" />

    <section v-else class="agendas-lista">
      <div v-if="agendasFiltradas.length === 0" class="agendas-empty">
        No se encontraron agendas con los filtros seleccionados.
      </div>

      <article
        v-for="agenda in agendasFiltradas"
        :key="agenda._id"
        class="agenda-card"
      >
        <div class="agenda-card-main">
          <div class="agenda-card-header">
            <div>
              <h2>{{ agenda.nombre }}</h2>
              <p class="agenda-subtitle">
                {{ agenda.especialidad?.nombre }} ·
                {{ agenda.profesional?.nombreCompleto }}
              </p>
            </div>

            <span
              class="estado-badge"
              :class="agenda.activa ? 'estado-badge--activa' : 'estado-badge--inactiva'"
            >
              {{ agenda.activa ? 'Activa' : 'Inactiva' }}
            </span>
          </div>

          <div class="agenda-card-body">
            <div class="agenda-col">
              <h3>Prestación principal</h3>
              <p>
                {{ agenda.prestacionPrincipal?.nombre || 'Sin prestación principal' }}
              </p>

              <h3>Días y horarios</h3>
              <p v-if="agenda.franjas && agenda.franjas.length">
                <span
                  v-for="grupo in agendaResumenFranjas(agenda)"
                  :key="grupo.dia"
                  class="agenda-horario-line"
                >
                  <strong>{{ grupo.dia }}:</strong>
                  {{ grupo.texto }}
                </span>
              </p>
              <p v-else>
                No se registraron franjas horarias para esta agenda.
              </p>
            </div>

            <div class="agenda-col agenda-col-right">
              <div class="agenda-col-info">
                <h3>{{ agenda.prestacionPrincipal?.nombre || 'Prestación' }}</h3>
                <p class="agenda-prestacion-right">
                  {{ agenda.prestacionPrincipal?.nombre || 'Sin prestación principal' }}
                </p>

                <p class="agenda-meta-line">
                  <span class="meta-label">Duración del turno</span>
                  <span class="meta-value">{{ agenda.duracionMinutos }} min</span>
                </p>
                <p class="agenda-meta-line">
                  <span class="meta-label">Límite prospectivo</span>
                  <span class="meta-value">{{ agenda.limiteProspectivoDias }} días</span>
                </p>
              </div>

              <button
                type="button"
                class="agenda-edit-btn"
                @click="irAEditar(agenda._id)"
              >
                <span class="edit-icon">✏️</span>
                Editar
              </button>
            </div>
          </div>

          <p class="agenda-id">ID: {{ agenda._id }}</p>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()

const loading = ref(true)
const agendas = ref([])

const filtroTexto = ref('')
const filtroEstado = ref('TODAS') // TODAS | ACTIVAS | INACTIVAS
const filtroEspecialidadId = ref('TODAS')

const cargarAgendas = async () => {
  loading.value = true
  try {
    const res = await api.get('/agendas')
    agendas.value = res.data || []
  } catch (err) {
    console.error('Error al cargar agendas', err)
  } finally {
    loading.value = false
  }
}

onMounted(cargarAgendas)

// Especialidades derivadas desde las agendas cargadas
const especialidadesDerivadas = computed(() => {
  const map = new Map()
  for (const ag of agendas.value) {
    const espId = ag.especialidad?._id || ag.especialidadId
    const espNombre = ag.especialidad?.nombre
    if (espId && espNombre && !map.has(espId)) {
      map.set(espId, espNombre)
    }
  }
  return Array.from(map.entries()).map(([id, nombre]) => ({ id, nombre }))
})

// Texto helper
const normalizar = (str) =>
  (str || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const agendasFiltradas = computed(() => {
  const texto = normalizar(filtroTexto.value)

  return agendas.value.filter((ag) => {
    // Filtro por estado
    if (filtroEstado.value === 'ACTIVAS' && !ag.activa) return false
    if (filtroEstado.value === 'INACTIVAS' && ag.activa) return false

    // Filtro por especialidad
    if (filtroEspecialidadId.value !== 'TODAS') {
      const espId = ag.especialidad?._id || ag.especialidadId
      if (espId !== filtroEspecialidadId.value) return false
    }

    // Filtro por texto
    if (!texto) return true

    const campos = [
      ag.nombre,
      ag.prestacionPrincipal?.nombre,
      ag.especialidad?.nombre,
      ag.profesional?.nombreCompleto
    ]

    return campos.some((c) => normalizar(c).includes(texto))
  })
})

// Resumen de franjas por día para mostrar en la card
const agendaResumenFranjas = (agenda) => {
  if (!agenda.franjas || !agenda.franjas.length) return []

  // Supongo que en cada franja viene: { dia: 'LUN', horaInicio, horaFin }
  const diasMap = {
    LUN: 'Lun',
    MAR: 'Mar',
    MIE: 'Mié',
    JUE: 'Jue',
    VIE: 'Vie',
    SAB: 'Sáb',
    DOM: 'Dom'
  }

  const porDia = agenda.franjas.reduce((acc, f) => {
    const key = f.dia
    if (!acc[key]) acc[key] = []
    acc[key].push(`${f.horaInicio}–${f.horaFin}`)
    return acc
  }, {})

  return Object.entries(porDia).map(([dia, franjas]) => ({
    dia: diasMap[dia] || dia,
    texto: franjas.join(', ')
  }))
}

const irAEditar = (id) => {
  router.push({ path: `/dashboard/agendas/${id}` })
}
</script>

<style scoped>
.agendas-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.agendas-header h1 {
  margin-bottom: 0.25rem;
}

.agendas-header p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--wm-text-muted);
}

/* Filtros */

.agendas-filtros {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.filtros-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.5fr) minmax(0, 1.5fr);
  gap: 1rem;
}

.estado-toggle {
  display: inline-flex;
  background: rgba(15, 23, 42, 0.9);
  border-radius: 999px;
  padding: 0.15rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
}

.estado-pill {
  border: none;
  background: transparent;
  color: var(--wm-text-muted);
  font-size: 0.8rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  cursor: pointer;
}

.estado-pill--active {
  background: linear-gradient(135deg, #34d399, #22c55e);
  color: #020617;
}

/* Lista */

.agendas-lista {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.agendas-empty {
  font-size: 0.9rem;
  color: var(--wm-text-muted);
}

.agenda-card {
  background: radial-gradient(circle at top left, rgba(15, 23, 42, 0.92), #020617);
  border-radius: 20px;
  padding: 1rem 1.25rem;
  border: 1px solid rgba(30, 64, 175, 0.7);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.8);
}

.agenda-card-main {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.agenda-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.agenda-card-header h2 {
  margin: 0;
  font-size: 1.1rem;
}

.agenda-subtitle {
  margin: 0.2rem 0 0;
  font-size: 0.8rem;
  color: var(--wm-text-muted);
}

.estado-badge {
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
}

.estado-badge--activa {
  background: rgba(16, 185, 129, 0.12);
  color: #4ade80;
}

.estado-badge--inactiva {
  background: rgba(148, 163, 184, 0.15);
  color: #9ca3af;
}

.agenda-card-body {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr);
  gap: 1rem;
  margin-top: 0.4rem;
}

.agenda-col h3 {
  margin: 0 0 0.15rem;
  font-size: 0.85rem;
}

.agenda-col p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--wm-text-light);
}

.agenda-horario-line {
  display: block;
}

.agenda-col-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.6rem;
}

.agenda-col-info {
  text-align: right;
}

.agenda-prestacion-right {
  font-weight: 500;
}

.agenda-meta-line {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.meta-label {
  color: var(--wm-text-muted);
}

.meta-value {
  font-weight: 500;
}

.agenda-edit-btn {
  margin-top: 0.3rem;
  align-self: flex-end;
  border: none;
  cursor: pointer;
  border-radius: 999px;
  padding: 0.45rem 1.1rem;
  font-size: 0.82rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: linear-gradient(135deg, #22c55e, #4ade80);
  color: #020617;
  box-shadow: 0 12px 30px rgba(16, 185, 129, 0.45);
}

.edit-icon {
  font-size: 0.9rem;
}

.agenda-id {
  margin: 0;
  margin-top: 0.5rem;
  font-size: 0.7rem;
  color: var(--wm-text-muted);
}

/* Responsive */

@media (max-width: 900px) {
  .filtros-grid {
    grid-template-columns: 1fr;
  }

  .agenda-card-body {
    grid-template-columns: 1fr;
  }

  .agenda-col-right {
    align-items: flex-start;
    text-align: left;
  }

  .agenda-col-info {
    text-align: left;
  }

  .agenda-edit-btn {
    align-self: flex-start;
  }
}
</style>
