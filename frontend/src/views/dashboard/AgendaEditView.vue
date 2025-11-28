<template>
  <div class="agenda-edit-page">
    <!-- MODAL DE ERROR (lista de mensajes) -->
    <div v-if="errorMessages.length" class="wm-modal-backdrop">
      <div class="wm-modal-card">
        <h2>Atención</h2>
        <ul class="wm-modal-list">
          <li v-for="(msg, i) in errorMessages" :key="i">
            {{ msg }}
          </li>
        </ul>
        <div class="wm-modal-actions">
          <button
            type="button"
            class="auth-button"
            @click="errorMessages = []"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>

    <header class="agenda-edit-header">
      <h1>Editar agenda</h1>
      <p>
        Modificá los datos de la agenda: profesional, especialidad, prestaciones
        y franjas horarias por día.
      </p>
    </header>

    <LoadingSpinner v-if="loading" />

    <form
      v-if="!loading"
      class="agenda-edit-form"
      @submit.prevent="guardar"
    >
      <!-- Nombre -->
      <div class="auth-field">
        <label>Nombre de la agenda</label>
        <input v-model="form.nombre" required />
      </div>

      <!-- Estado -->
      <div class="auth-field">
        <label>Estado</label>
        <select v-model="form.activa" class="auth-select">
          <option :value="true">Activa</option>
          <option :value="false">Inactiva</option>
        </select>
      </div>

      <!-- Profesional -->
      <div class="auth-field">
        <label>Profesional a cargo</label>
        <select
          v-model="form.profesionalId"
          class="auth-select"
          required
        >
          <option disabled value="">Seleccioná un profesional</option>
          <option
            v-for="prof in profesionales"
            :key="prof._id"
            :value="prof._id"
          >
            {{ prof.nombreCompleto }}
          </option>
        </select>
      </div>

      <!-- Especialidad -->
      <div class="auth-field">
        <label>Especialidad</label>
        <select
          v-model="form.especialidadId"
          class="auth-select"
          required
          @change="onEspecialidadChange"
        >
          <option disabled value="">Seleccioná una especialidad</option>
          <option
            v-for="esp in especialidades"
            :key="esp._id"
            :value="esp._id"
          >
            {{ esp.nombre }}
          </option>
        </select>
      </div>

      <!-- Prestaciones (chips) -->
      <div class="auth-field">
        <label>Prestaciones de la agenda</label>
        <p class="field-hint">
          Seleccioná las prestaciones que va a ofrecer esta agenda y marcá una
          como principal.
        </p>

        <div v-if="prestacionesFiltradas.length === 0" class="prestaciones-empty">
          No hay prestaciones para la especialidad seleccionada.
        </div>

        <div v-else class="prestaciones-grid">
          <button
            v-for="prest in prestacionesFiltradas"
            :key="prest._id"
            type="button"
            class="prestacion-chip"
            :class="{
              'prestacion-chip--seleccionada': form.prestacionesIds.includes(prest._id),
              'prestacion-chip--principal': form.prestacionPrincipalId === prest._id
            }"
            @click="togglePrestacion(prest._id)"
          >
            <div class="prestacion-main">
              <span class="prestacion-nombre">{{ prest.nombre }}</span>
              <span
                v-if="form.prestacionesIds.includes(prest._id)"
                class="prestacion-tag"
              >
                Incluida
              </span>
            </div>

            <button
              type="button"
              class="prestacion-star-btn"
              :disabled="!form.prestacionesIds.includes(prest._id)"
              @click.stop="setPrestacionPrincipal(prest._id)"
              :title="getStarTitle(prest._id)"
            >
              <span
                class="star-icon"
                :class="{ 'star-icon--active': form.prestacionPrincipalId === prest._id }"
              >
                ★
              </span>
            </button>
          </button>
        </div>

        <p class="field-hint field-hint--inline">
          ● Click en la tarjeta para incluir/quitar la prestación.  
          ● Click en la estrella para definir la prestación principal.
        </p>
      </div>

      <!-- Duración y límite -->
      <div class="agenda-horario-grid">
        <div class="auth-field">
          <label>Duración del turno (minutos)</label>
          <input
            type="number"
            min="5"
            max="480"
            v-model.number="form.duracionMinutos"
            required
          />
          <small class="field-hint">
            Todas las franjas deben ser múltiplo de esta duración.
          </small>
        </div>

        <div class="auth-field">
          <label>Límite prospectivo (días)</label>
          <input
            type="number"
            min="1"
            max="365"
            v-model.number="form.limiteProspectivoDias"
          />
        </div>
      </div>

      <!-- Franjas por día -->
      <div class="auth-field">
        <label>Franjas horarias semanales</label>
        <div class="field-hint">
          Podés definir varias franjas por día (ej: 08:00–12:00 o 16:00–18:00).
          Cada franja debe ser múltiplo de la duración configurada.
        </div>

        <div class="franjas-semanales">
          <div
            v-for="dia in diasSemanaOpciones"
            :key="dia.codigo"
            class="dia-franja-card"
          >
            <div class="dia-franja-header">
              <span class="dia-label">{{ dia.label }}</span>
              <button
                type="button"
                class="dia-add-btn"
                @click="agregarFranja(dia.codigo)"
              >
                + Agregar franja
              </button>
            </div>

            <div
              v-if="franjasPorDia(dia.codigo).length"
              class="franjas-list"
            >
              <div
                v-for="franja in franjasPorDia(dia.codigo)"
                :key="franja._uid"
                class="franja-item"
              >
                <input
                  type="time"
                  v-model="franja.horaInicio"
                  required
                />
                <span class="franja-sep">–</span>
                <input
                  type="time"
                  v-model="franja.horaFin"
                  required
                />
                <button
                  type="button"
                  class="franja-delete-btn"
                  @click="eliminarFranja(franja)"
                  title="Eliminar franja"
                >
                  🗑
                </button>
              </div>
            </div>

            <p
              v-else
              class="franjas-empty"
            >
              Sin franjas
            </p>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button
          type="button"
          class="cancel-btn"
          @click="volver"
        >
          Cancelar
        </button>

        <button
          type="submit"
          class="auth-button"
          :disabled="saving"
        >
          {{ saving ? 'Guardando...' : 'Guardar cambios' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const errorMessages = ref([])

const profesionales = ref([])
const especialidades = ref([])
const prestaciones = ref([])

const diasSemanaOpciones = [
  { codigo: 'LUN', label: 'Lun' },
  { codigo: 'MAR', label: 'Mar' },
  { codigo: 'MIE', label: 'Mié' },
  { codigo: 'JUE', label: 'Jue' },
  { codigo: 'VIE', label: 'Vie' },
  { codigo: 'SAB', label: 'Sáb' },
  { codigo: 'DOM', label: 'Dom' }
]

const diaLabel = codigo =>
  diasSemanaOpciones.find(d => d.codigo === codigo)?.label || codigo

let franjaUid = 0
const newFranja = (dia, horaInicio = '08:00', horaFin = '12:00') => ({
  _uid: ++franjaUid,
  dia,
  horaInicio,
  horaFin
})

const form = ref({
  nombre: '',
  activa: true,
  profesionalId: '',
  especialidadId: '',
  prestacionesIds: [],
  prestacionPrincipalId: '',
  duracionMinutos: 20,
  limiteProspectivoDias: 30,
  franjas: []
})

const mapId = value =>
  typeof value === 'string' ? value : value?._id ?? ''

const cargarDatosIniciales = async () => {
  loading.value = true
  errorMessages.value = []
  try {
    const [agendaRes, profRes, espRes, prestRes] = await Promise.all([
      api.get(`/agendas/${route.params.id}`),
      api.get('/profesionales'),
      api.get('/especialidades'),
      api.get('/prestaciones')
    ])

    profesionales.value = profRes.data || []
    especialidades.value = espRes.data || []
    prestaciones.value = prestRes.data || []

    const data = agendaRes.data

    let franjas = []

    if (Array.isArray(data.franjas) && data.franjas.length > 0) {
      franjas = data.franjas.map(f =>
        newFranja(f.dia, f.horaInicio, f.horaFin)
      )
    } else if (
      Array.isArray(data.diasSemana) &&
      data.diasSemana.length > 0 &&
      data.horaInicio &&
      data.horaFin
    ) {
      franjas = data.diasSemana.map(d =>
        newFranja(d, data.horaInicio, data.horaFin)
      )
    }

    form.value = {
      nombre: data.nombre || '',
      activa: data.activa ?? true,
      profesionalId: mapId(data.profesionalId),
      especialidadId: mapId(data.especialidadId),
      prestacionesIds: (data.prestacionesIds || []).map(mapId),
      prestacionPrincipalId: mapId(data.prestacionPrincipalId),
      duracionMinutos: data.duracionMinutos || 20,
      limiteProspectivoDias: data.limiteProspectivoDias || 30,
      franjas
    }
  } catch (err) {
    console.error(err)
    errorMessages.value = ['No se pudo cargar la agenda o datos asociados.']
  } finally {
    loading.value = false
  }
}

onMounted(cargarDatosIniciales)

const prestacionesFiltradas = computed(() => {
  if (!form.value.especialidadId) return []
  return prestaciones.value.filter(
    p => mapId(p.especialidadId) === form.value.especialidadId
  )
})

const onEspecialidadChange = () => {
  form.value.prestacionesIds = []
  form.value.prestacionPrincipalId = ''
}

/* Prestaciones chips */

const togglePrestacion = id => {
  const idx = form.value.prestacionesIds.indexOf(id)
  if (idx === -1) {
    form.value.prestacionesIds.push(id)
  } else {
    form.value.prestacionesIds.splice(idx, 1)
    if (form.value.prestacionPrincipalId === id) {
      form.value.prestacionPrincipalId = ''
    }
  }
}

const setPrestacionPrincipal = id => {
  if (!form.value.prestacionesIds.includes(id)) return
  form.value.prestacionPrincipalId = id
}

const getStarTitle = id => {
  if (!form.value.prestacionesIds.includes(id)) {
    return 'Primero incluí la prestación en la agenda'
  }
  return form.value.prestacionPrincipalId === id
    ? 'Prestación principal actual'
    : 'Marcar como prestación principal'
}

/* Franjas */

const franjasPorDia = diaCode =>
  form.value.franjas.filter(f => f.dia === diaCode)

const agregarFranja = diaCode => {
  form.value.franjas.push(newFranja(diaCode))
}

const eliminarFranja = franja => {
  const idx = form.value.franjas.findIndex(f => f._uid === franja._uid)
  if (idx !== -1) {
    form.value.franjas.splice(idx, 1)
  }
}

const horaToMinutos = hhmm => {
  const [h, m] = (hhmm || '00:00').split(':').map(Number)
  return h * 60 + m
}

const guardar = async () => {
  errorMessages.value = []
  saving.value = true

  try {
    const msgs = []

    // Validaciones básicas
    if (!form.value.franjas.length) {
      msgs.push('Debés definir al menos una franja horaria.')
    }

    const dur = Number(form.value.duracionMinutos || 0)
    if (!dur || dur <= 0) {
      msgs.push('La duración del turno debe ser un número mayor a 0.')
    }

    // Validaciones por franja
    if (dur > 0) {
      for (const f of form.value.franjas) {
        const diaTxt = diaLabel(f.dia)

        if (!f.horaInicio || !f.horaFin) {
          msgs.push(
            `[${diaTxt}] Todas las franjas deben tener hora de inicio y fin.`
          )
          continue
        }

        if (f.horaFin <= f.horaInicio) {
          msgs.push(
            `[${diaTxt}] En la franja ${f.horaInicio}–${f.horaFin}, la hora de fin debe ser mayor a la de inicio.`
          )
          continue
        }

        const inicio = horaToMinutos(f.horaInicio)
        const fin = horaToMinutos(f.horaFin)
        const diff = fin - inicio

        if (diff < dur) {
          msgs.push(
            `[${diaTxt}] La franja ${f.horaInicio}–${f.horaFin} es menor que la duración de un turno (${dur} min).`
          )
        } else if (diff % dur !== 0) {
          msgs.push(
            `[${diaTxt}] La franja ${f.horaInicio}–${f.horaFin} no es múltiplo de la duración actual (${dur} min). Ajustá el horario o la duración.`
          )
        }
      }
    }

    // Prestaciones
    if (!form.value.prestacionesIds.length) {
      msgs.push('Debés seleccionar al menos una prestación.')
    }

    if (!form.value.prestacionPrincipalId) {
      msgs.push('Debés marcar una prestación principal.')
    } else if (
      !form.value.prestacionesIds.includes(form.value.prestacionPrincipalId)
    ) {
      msgs.push(
        'La prestación principal debe estar incluida dentro de las prestaciones de la agenda.'
      )
    }

    // Si hay mensajes, los mostramos en el modal y no mandamos nada al backend
    if (msgs.length) {
      errorMessages.value = msgs
      saving.value = false
      return
    }

    // Payload sin _uid
    const payload = {
      ...form.value,
      franjas: form.value.franjas.map(f => ({
        dia: f.dia,
        horaInicio: f.horaInicio,
        horaFin: f.horaFin
      }))
    }

    await api.put(`/agendas/${route.params.id}`, payload)

    router.push({ path: '/dashboard/agendas' })
  } catch (err) {
    console.error(err)
    errorMessages.value = [
      err?.response?.data?.message ||
        err.message ||
        'Error al guardar cambios.'
    ]
  } finally {
    saving.value = false
  }
}

const volver = () => {
  router.push({ path: '/dashboard/agendas' })
}
</script>

<style scoped>
.agenda-edit-page {
  max-width: 900px;
}

.agenda-edit-header {
  margin-bottom: 1rem;
}

.agenda-edit-header h1 {
  margin-bottom: 0.3rem;
}

.agenda-edit-header p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--wm-text-muted);
}

.agenda-edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.agenda-horario-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.field-hint {
  font-size: 0.75rem;
  color: var(--wm-text-muted);
}

.field-hint--inline {
  margin-top: 0.25rem;
}

/* MODAL */

.wm-modal-backdrop {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at top, rgba(15,23,42,0.9), rgba(15,23,42,0.96));
  backdrop-filter: blur(4px);
  z-index: 50;

  display: flex;
  align-items: center;
  justify-content: center;
}

.wm-modal-card {
  background: #020617;
  border-radius: 18px;
  padding: 1.4rem 1.6rem;
  max-width: 520px;
  width: 90%;
  border: 1px solid rgba(248, 113, 113, 0.7);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.9);
}

.wm-modal-card h2 {
  margin: 0 0 0.4rem;
  font-size: 1.15rem;
}

.wm-modal-list {
  margin: 0.3rem 0 0;
  padding-left: 1.2rem;
  font-size: 0.9rem;
  color: #fecaca;
}

.wm-modal-list li + li {
  margin-top: 0.15rem;
}

.wm-modal-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

/* Prestaciones chips */

.prestaciones-empty {
  font-size: 0.85rem;
  color: var(--wm-text-muted);
}

.prestaciones-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.4rem;
}

.prestacion-chip {
  position: relative;
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.4rem;

  min-width: 0;
  padding: 0.5rem 0.7rem 0.5rem 0.8rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.5);

  background: rgba(15, 23, 42, 0.98);
  color: var(--wm-text-light);

  cursor: pointer;
  font-size: 0.8rem;

  transition:
    background 0.08s ease-out,
    border-color 0.08s ease-out,
    box-shadow 0.08s ease-out,
    transform 0.08s ease-out;
}

.prestacion-chip--seleccionada {
  border-color: rgba(45, 212, 191, 0.7);
  background: radial-gradient(
    circle at top left,
    rgba(16, 185, 129, 0.12),
    rgba(15, 23, 42, 0.98)
  );
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.35);
}

.prestacion-chip--principal {
  border-color: rgba(74, 222, 128, 0.95);
  box-shadow: 0 0 0 1px rgba(74, 222, 128, 0.45),
    0 10px 26px rgba(22, 163, 74, 0.5);
}

.prestacion-chip:hover {
  transform: translateY(-1px);
}

.prestacion-main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
}

.prestacion-nombre {
  font-weight: 500;
  white-space: nowrap;
}

.prestacion-tag {
  font-size: 0.7rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.26);
}

.prestacion-star-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prestacion-star-btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.star-icon {
  font-size: 1rem;
  color: rgba(148, 163, 184, 0.9);
}

.star-icon--active {
  color: #22c55e;
}

/* Franjas semanales */

.franjas-semanales {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.dia-franja-card {
  background: rgba(15, 23, 42, 0.96);
  border-radius: 14px;
  padding: 0.7rem 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.dia-franja-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.4rem;
}

.dia-label {
  font-size: 0.85rem;
  font-weight: 600;
}

.dia-add-btn {
  border-radius: 999px;
  border: 1px dashed rgba(148, 163, 184, 0.6);
  background: transparent;
  color: var(--wm-text-muted);
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  cursor: pointer;
}

.dia-add-btn:hover {
  border-style: solid;
  color: var(--wm-text-light);
}

.franjas-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.franja-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.franja-item input[type='time'] {
  background: rgba(15, 23, 42, 0.9);
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  color: var(--wm-text-light);
}

.franja-sep {
  font-size: 0.8rem;
  color: var(--wm-text-muted);
}

.franja-delete-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;
  color: rgba(248, 113, 113, 0.9);
}

.franjas-empty {
  font-size: 0.75rem;
  color: var(--wm-text-muted);
  margin: 0.1rem 0 0;
}

/* Acciones */

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.cancel-btn {
  background: none;
  border: 1px solid rgba(148, 163, 184, 0.5);
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  color: var(--wm-text-light);
  cursor: pointer;
}
</style>
