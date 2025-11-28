<template>
  <div class="turnos-page">
    <header class="turnos-header">
      <h1>Otorgar turnos</h1>
      <p>
        Seleccioná una agenda, visualizá los horarios disponibles y otorgá un turno
        a un paciente.
      </p>
    </header>

    <!-- FILTROS BÁSICOS -->
    <section class="turnos-filtros">
      <div class="filtros-grid">
        <!-- Agenda -->
        <div class="auth-field">
          <label>Agenda</label>
          <select
            v-model="agendaSeleccionadaId"
            class="auth-select"
          >
            <option disabled value="">Seleccioná una agenda</option>
            <option
              v-for="ag in agendas"
              :key="ag._id"
              :value="ag._id"
            >
              {{ ag.nombre }}
              ·
              {{ ag.especialidad?.nombre }}
              ·
              {{ ag.profesional?.nombreCompleto }}
            </option>
          </select>
        </div>

        <!-- Fecha desde -->
        <div class="auth-field">
          <label>Fecha desde</label>
          <input
            type="date"
            v-model="fechaDesde"
          />
          <small class="field-hint">
            Se mostrarán los turnos disponibles a partir de esta fecha dentro del
            límite prospectivo de la agenda.
          </small>
        </div>

        <!-- Botón de búsqueda -->
        <div class="auth-field filtros-acciones">
          <label class="invisible-label">Acciones</label>
          <button
            type="button"
            class="auth-button"
            :disabled="!agendaSeleccionadaId || cargandoSlots"
            @click="buscarSlots"
          >
            {{ cargandoSlots ? 'Buscando...' : 'Buscar turnos disponibles' }}
          </button>
        </div>
      </div>
    </section>

    <LoadingSpinner v-if="loadingAgendas" />

    <!-- LISTA DE SLOTS + PANEL DE TURNO -->
    <section v-else class="turnos-layout">
      <div class="slots-panel">
        <div class="slots-header">
          <h2>Turnos disponibles</h2>
          <p v-if="agendaActual">
            {{ agendaActual.nombre }} ·
            {{ agendaActual.especialidad?.nombre }} ·
            {{ agendaActual.profesional?.nombreCompleto }}
          </p>
        </div>

        <div v-if="!slots.length && !cargandoSlots" class="slots-empty">
          No hay turnos disponibles para los filtros seleccionados.
        </div>

        <LoadingSpinner v-if="cargandoSlots" />

        <div
          v-else
          class="slots-list"
        >
          <div
            v-for="grupo in slotsAgrupados"
            :key="grupo.fecha"
            class="slots-dia-card"
          >
            <div class="slots-dia-header">
              <span class="slots-dia-fecha">
                {{ formatearFechaHumana(grupo.fecha) }}
              </span>
              <span class="slots-dia-sub">
                {{ grupo.slots.length }} turno(s)
              </span>
            </div>

            <div class="slots-dia-grid">
              <button
                v-for="slot in grupo.slots"
                :key="slot.fecha + '|' + slot.hora"
                type="button"
                class="slot-pill"
                :class="{
                  'slot-pill--selected':
                    slotSeleccionado &&
                    slotSeleccionado.fecha === slot.fecha &&
                    slotSeleccionado.hora === slot.hora
                }"
                @click="seleccionarSlot(slot)"
              >
                {{ slot.hora }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- PANEL DERECHO: FORMULARIO DE TURNO -->
      <aside class="turno-panel" v-if="agendaActual">
        <div class="turno-panel-header">
          <h2>Datos del turno</h2>
          <p>
            Completá los datos del paciente y confirmá el turno en el horario
            seleccionado.
          </p>
        </div>

        <div v-if="slotSeleccionado" class="turno-resumen-slot">
          <p class="turno-resumen-titulo">Turno seleccionado</p>
          <p class="turno-resumen-line">
            <strong>Fecha:</strong> {{ formatearFechaHumana(slotSeleccionado.fecha) }}
          </p>
          <p class="turno-resumen-line">
            <strong>Hora:</strong> {{ slotSeleccionado.hora }}
          </p>
          <p class="turno-resumen-line">
            <strong>Prestación principal:</strong>
            {{ agendaActual.prestacionPrincipal?.nombre }}
          </p>
        </div>
        <div v-else class="turno-resumen-placeholder">
          Seleccioná un horario disponible en la lista para cargar los datos del
          paciente.
        </div>

        <form
          class="turno-form"
          @submit.prevent="crearTurno"
        >
          <div class="auth-field">
            <label>Nombre y apellido del paciente</label>
            <input
              v-model="turnoForm.pacienteNombre"
              :disabled="!slotSeleccionado || creandoTurno"
              required
            />
          </div>

          <div class="auth-field">
            <label>Documento del paciente</label>
            <input
              v-model="turnoForm.pacienteDocumento"
              :disabled="!slotSeleccionado || creandoTurno"
              placeholder="DNI, CUIT, pasaporte..."
              required
            />
          </div>

          <!-- Prestaciones extra -->
          <div class="auth-field">
            <label>Prestaciones adicionales</label>
            <p class="field-hint">
              Opcional. Podés asociar prestaciones complementarias a este turno.
            </p>

            <div v-if="prestacionesExtra.length === 0" class="prest-extras-empty">
              No hay prestaciones adicionales configuradas para esta agenda.
            </div>

            <div v-else class="prest-extras-grid">
              <label
                v-for="prest in prestacionesExtra"
                :key="prest._id"
                class="prest-extra-chip"
              >
                <input
                  type="checkbox"
                  :value="prest._id"
                  v-model="turnoForm.prestacionesExtraIds"
                  :disabled="!slotSeleccionado || creandoTurno"
                />
                <span>{{ prest.nombre }}</span>
              </label>
            </div>
          </div>

          <!-- Mensajes -->
          <p v-if="error" class="turno-error">{{ error }}</p>
          <p v-if="mensajeOk" class="turno-ok">{{ mensajeOk }}</p>

          <div class="turno-actions">
            <button
              type="submit"
              class="auth-button"
              :disabled="!slotSeleccionado || creandoTurno"
            >
              {{ creandoTurno ? 'Otorgando turno...' : 'Confirmar turno' }}
            </button>
          </div>
        </form>
      </aside>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const agendas = ref([])
const loadingAgendas = ref(true)

const agendaSeleccionadaId = ref('')
const fechaDesde = ref(hoyISO())

const slots = ref([])
const cargandoSlots = ref(false)

const slotSeleccionado = ref(null)

const turnoForm = ref({
  pacienteNombre: '',
  pacienteDocumento: '',
  prestacionesExtraIds: []
})

const creandoTurno = ref(false)
const error = ref('')
const mensajeOk = ref('')

function hoyISO () {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Carga de agendas
const cargarAgendas = async () => {
  loadingAgendas.value = true
  try {
    const res = await api.get('/agendas')
    agendas.value = res.data || []
  } catch (err) {
    console.error('Error al cargar agendas', err)
  } finally {
    loadingAgendas.value = false
  }
}

onMounted(cargarAgendas)

const agendaActual = computed(() =>
  agendas.value.find(a => a._id === agendaSeleccionadaId.value)
)

// Prestaciones extra: todas las prestaciones de la agenda menos la principal
const prestacionesExtra = computed(() => {
  if (!agendaActual.value) return []
  const principalId = agendaActual.value.prestacionPrincipal?._id
    || agendaActual.value.prestacionPrincipalId
  const lista = agendaActual.value.prestaciones || agendaActual.value.prestacionesIds || []
  return lista.filter(p => {
    const id = p._id || p
    return id !== principalId
  })
})

// Slots agrupados por fecha
const slotsAgrupados = computed(() => {
  const map = new Map()
  for (const s of slots.value) {
    if (!map.has(s.fecha)) map.set(s.fecha, [])
    map.get(s.fecha).push(s)
  }
  return Array.from(map.entries()).map(([fecha, arr]) => ({
    fecha,
    slots: arr
  }))
})

// Helpers
const formatearFechaHumana = (fechaStr) => {
  // fechaStr = "YYYY-MM-DD"
  const [year, month, day] = fechaStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('es-AR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Acciones
const buscarSlots = async () => {
  if (!agendaSeleccionadaId.value) return

  cargandoSlots.value = true
  slots.value = []
  slotSeleccionado.value = null
  error.value = ''
  mensajeOk.value = ''
  turnoForm.value = {
    pacienteNombre: '',
    pacienteDocumento: '',
    prestacionesExtraIds: []
  }

  try {
    const res = await api.get(
      `/turnos/slots/${agendaSeleccionadaId.value}`,
      {
        params: fechaDesde.value ? { fechaDesde: fechaDesde.value } : {}
      }
    )

    const data = res.data || {}
    slots.value = data.slots || []
  } catch (err) {
    console.error('Error al obtener slots', err)
    error.value =
      err?.response?.data?.message ||
      'No se pudieron cargar los turnos disponibles.'
  } finally {
    cargandoSlots.value = false
  }
}

const seleccionarSlot = (slot) => {
  slotSeleccionado.value = { ...slot }
  mensajeOk.value = ''
  error.value = ''
}

const crearTurno = async () => {
  if (!slotSeleccionado.value || !agendaActual.value) return

  error.value = ''
  mensajeOk.value = ''
  creandoTurno.value = true

  try {
    const payload = {
      agendaId: agendaActual.value._id,
      fecha: slotSeleccionado.value.fecha,
      hora: slotSeleccionado.value.hora,
      pacienteNombre: turnoForm.value.pacienteNombre,
      pacienteDocumento: turnoForm.value.pacienteDocumento,
      prestacionesExtraIds: turnoForm.value.prestacionesExtraIds
    }

    const res = await api.post('/turnos', payload)

    // Feedback
    mensajeOk.value = `Turno creado correctamente para ${res.data?.pacienteNombre || payload.pacienteNombre}.`

    // Sacamos el slot usado de la lista
    slots.value = slots.value.filter(
      (s) =>
        !(s.fecha === slotSeleccionado.value.fecha &&
          s.hora === slotSeleccionado.value.hora)
    )
    slotSeleccionado.value = null

    // Limpiamos form
    turnoForm.value = {
      pacienteNombre: '',
      pacienteDocumento: '',
      prestacionesExtraIds: []
    }
  } catch (err) {
    console.error('Error al crear turno', err)
    error.value =
      err?.response?.data?.message ||
      'No se pudo crear el turno. Verificá los datos e intentá nuevamente.'
  } finally {
    creandoTurno.value = false
  }
}
</script>

<style scoped>
.turnos-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.turnos-header h1 {
  margin-bottom: 0.25rem;
}

.turnos-header p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--wm-text-muted);
}

/* FILTROS */

.turnos-filtros {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.filtros-grid {
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) minmax(0, 1.4fr) minmax(0, 1.4fr);
  gap: 1rem;
}

.filtros-acciones {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.invisible-label {
  visibility: hidden;
}

/* LAYOUT PRINCIPAL */

.turnos-layout {
  display: grid;
  grid-template-columns: minmax(0, 2.1fr) minmax(0, 1.4fr);
  gap: 1rem;
}

.slots-panel {
  background: radial-gradient(circle at top left, rgba(15, 23, 42, 0.92), #020617);
  border-radius: 20px;
  padding: 1rem 1.25rem;
  border: 1px solid rgba(30, 64, 175, 0.7);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.8);
}

.slots-header h2 {
  margin: 0 0 0.1rem;
  font-size: 1rem;
}

.slots-header p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--wm-text-muted);
}

.slots-empty {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--wm-text-muted);
}

/* SLOTS POR DÍA */

.slots-list {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.slots-dia-card {
  border-radius: 16px;
  padding: 0.75rem 0.8rem;
  background: rgba(15, 23, 42, 0.96);
  border: 1px solid rgba(30, 64, 175, 0.6);
}

.slots-dia-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.slots-dia-fecha {
  font-weight: 600;
  font-size: 0.9rem;
}

.slots-dia-sub {
  font-size: 0.75rem;
  color: var(--wm-text-muted);
}

.slots-dia-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.slot-pill {
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: rgba(15, 23, 42, 0.9);
  color: var(--wm-text-light);
  font-size: 0.8rem;
  padding: 0.2rem 0.8rem;
  cursor: pointer;
  transition:
    background 0.08s ease-out,
    border-color 0.08s ease-out,
    box-shadow 0.08s ease-out,
    transform 0.08s ease-out;
}

.slot-pill:hover {
  transform: translateY(-1px);
  border-color: rgba(45, 212, 191, 0.9);
}

.slot-pill--selected {
  background: linear-gradient(135deg, #22c55e, #4ade80);
  color: #020617;
  border-color: transparent;
  box-shadow: 0 12px 26px rgba(16, 185, 129, 0.55);
}

/* PANEL DE TURNO */

.turno-panel {
  background: radial-gradient(circle at top right, rgba(15, 23, 42, 0.95), #020617);
  border-radius: 20px;
  padding: 1rem 1.25rem;
  border: 1px solid rgba(30, 64, 175, 0.7);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.8);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.turno-panel-header h2 {
  margin: 0 0 0.1rem;
  font-size: 1rem;
}

.turno-panel-header p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--wm-text-muted);
}

.turno-resumen-slot {
  background: rgba(15, 23, 42, 0.96);
  border-radius: 14px;
  padding: 0.6rem 0.8rem;
  border: 1px solid rgba(45, 212, 191, 0.4);
  font-size: 0.8rem;
}

.turno-resumen-titulo {
  margin: 0 0 0.2rem;
  font-weight: 600;
}

.turno-resumen-line {
  margin: 0;
}

.turno-resumen-line + .turno-resumen-line {
  margin-top: 0.1rem;
}

.turno-resumen-placeholder {
  font-size: 0.8rem;
  color: var(--wm-text-muted);
  background: rgba(15, 23, 42, 0.9);
  border-radius: 14px;
  padding: 0.6rem 0.8rem;
}

.turno-form {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-top: 0.2rem;
}

/* Prestaciones extra */

.prest-extras-empty {
  font-size: 0.8rem;
  color: var(--wm-text-muted);
}

.prest-extras-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.3rem;
}

.prest-extra-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.78rem;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: rgba(15, 23, 42, 0.95);
}

.prest-extra-chip input {
  accent-color: #22c55e;
}

/* Mensajes */

.turno-error {
  font-size: 0.8rem;
  color: #fecaca;
}

.turno-ok {
  font-size: 0.8rem;
  color: #bbf7d0;
}

.turno-actions {
  display: flex;
  justify-content: flex-end;
}

/* Helpers */

.field-hint {
  font-size: 0.75rem;
  color: var(--wm-text-muted);
}

/* Responsive */

@media (max-width: 980px) {
  .filtros-grid {
    grid-template-columns: 1fr;
  }

  .turnos-layout {
    grid-template-columns: 1fr;
  }
}
</style>
